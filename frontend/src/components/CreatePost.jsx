import { useRef, useState, useEffect } from "react";
import api from "../api";

function CreatePost({ user, onPostCreated }) {

  const fileInputRef = useRef(null);
  const feelingWrapperRef = useRef(null);

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [feeling, setFeeling] = useState("");
  const [posting, setPosting] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [showFeelings, setShowFeelings] = useState(false);


  // =========================================
  // FEELINGS
  // =========================================

  const feelings = [
    "😊 Happy",
    "😍 Excited",
    "😂 Funny",
    "🥰 Loved",
    "😎 Cool",
    "😢 Sad",
    "🔥 Motivated",
  ];


  // =========================================
  // CLOSE FEELING MENU
  // =========================================

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        feelingWrapperRef.current &&
        !feelingWrapperRef.current.contains(
          event.target
        )
      ) {
        setShowFeelings(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // =========================================
  // FILE SELECT
  // =========================================

  const handleFileSelect = (e) => {

    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      return;
    }


    // Check image
    const isImage =
      selectedFile.type.startsWith("image/");


    // Check video
    const isVideo =
      selectedFile.type.startsWith("video/");


    // Invalid file
    if (!isImage && !isVideo) {

      alert(
        "Please select a valid image or video."
      );

      e.target.value = "";

      return;
    }


    // File size
    const maxSize =
      isVideo
        ? 100 * 1024 * 1024
        : 10 * 1024 * 1024;


    if (selectedFile.size > maxSize) {

      alert(
        isVideo
          ? "Video must be smaller than 100 MB."
          : "Image must be smaller than 10 MB."
      );

      e.target.value = "";

      return;
    }


    // Store file
    setFile(selectedFile);


    // Store type
    setSelectedType(
      isVideo
        ? "VIDEO"
        : "IMAGE"
    );

  };


  // =========================================
  // REMOVE FILE
  // =========================================

  const removeFile = () => {

    setFile(null);

    setSelectedType("");

    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }

  };


  // =========================================
  // SELECT FEELING
  // =========================================

  const selectFeeling = (selectedFeeling) => {

    setFeeling(selectedFeeling);

    setShowFeelings(false);

  };


  // =========================================
  // REMOVE FEELING
  // =========================================

  const removeFeeling = () => {

    setFeeling("");

    setShowFeelings(false);

  };


  // =========================================
  // CREATE POST
  // =========================================

  const createPost = async () => {

    // -----------------------------------------
    // EMPTY POST CHECK
    // -----------------------------------------

    if (
      !caption.trim() &&
      !file &&
      !feeling
    ) {

      alert(
        "Write something, select a photo/video, or choose a feeling first."
      );

      return;
    }


    try {

      setPosting(true);


      // =======================================
      // FORM DATA
      // =======================================

      const formData =
        new FormData();


      // =======================================
      // CAPTION
      // =======================================

      let finalCaption =
        caption.trim();


      // =======================================
      // FEELING
      // =======================================

      /*
       * The current Post model does not have
       * a separate feeling field.
       *
       * Therefore feeling is added to caption.
       */

      if (feeling) {

        finalCaption =
          finalCaption
            ? `${finalCaption} ${feeling}`
            : feeling;

      }


      formData.append(
        "caption",
        finalCaption
      );


      // =======================================
      // LOCATION
      // =======================================

      /*
       * IMPORTANT:
       *
       * If user has country/state,
       * use them.
       *
       * If they are missing,
       * default to India/Karnataka.
       *
       * This prevents new posts from becoming
       * "Unknown" in Admin Analytics.
       */

      const postCountry =
        user?.country?.trim() ||
        "India";

      const postState =
        user?.state?.trim() ||
        "Karnataka";


      formData.append(
        "country",
        postCountry
      );


      formData.append(
        "state",
        postState
      );


      // =======================================
      // PHOTO / VIDEO
      // =======================================

      if (file) {

        formData.append(
          "file",
          file,
          file.name
        );

      }


      // =======================================
      // DEBUG
      // =======================================

      console.log(
        "================================="
      );

      console.log(
        "Creating SocialPulse post..."
      );

      console.log(
        "Caption:",
        finalCaption
      );

      console.log(
        "Feeling:",
        feeling
      );

      console.log(
        "Country:",
        postCountry
      );

      console.log(
        "State:",
        postState
      );

      console.log(
        "File:",
        file
      );

      console.log(
        "File name:",
        file?.name
      );

      console.log(
        "File type:",
        file?.type
      );

      console.log(
        "Media type:",
        selectedType
      );

      console.log(
        "================================="
      );


      // =======================================
      // SEND TO BACKEND
      // =======================================

      const response =
        await api.post(
          "/posts",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );


      console.log(
        "Post created successfully:"
      );

      console.log(
        response.data
      );


      // =======================================
      // RESET FORM
      // =======================================

      setCaption("");

      setFile(null);

      setFeeling("");

      setSelectedType("");

      setShowFeelings(false);


      if (fileInputRef.current) {

        fileInputRef.current.value = "";

      }


      // =======================================
      // UPDATE HOME FEED
      // =======================================

      if (onPostCreated) {

        onPostCreated(
          response.data
        );

      }

    } catch (error) {

      console.error(
        "Failed to create post:",
        error
      );


      console.error(
        "Backend response:",
        error.response?.data
      );


      alert(
        error.response?.data ||
        error.message ||
        "Failed to create post."
      );

    } finally {

      setPosting(false);

    }

  };


  // =========================================
  // AVATAR
  // =========================================

  const avatar =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() ||

    user?.username
      ?.charAt(0)
      ?.toUpperCase() ||

    "U";


  // =========================================
  // UI
  // =========================================

  return (

    <section className="create-post">


      {/* =====================================
          AVATAR
      ===================================== */}

      <div className="avatar">

        {avatar}

      </div>


      <div className="post-input-area">


        {/* =====================================
            CAPTION
        ===================================== */}

        <textarea
          placeholder="What's happening?"
          value={caption}
          onChange={(e) =>
            setCaption(e.target.value)
          }
          maxLength={1000}
        />


        {/* =====================================
            SELECTED MEDIA
        ===================================== */}

        {file && (

          <div className="selected-media">

            <div>

              <span
                style={{
                  fontSize: "18px"
                }}
              >

                {selectedType === "VIDEO"
                  ? "🎥"
                  : "📷"}

              </span>

              {" "}

              <strong>
                {file.name}
              </strong>

            </div>


            <button
              type="button"
              onClick={removeFile}
            >

              ✕

            </button>

          </div>

        )}


        {/* =====================================
            SELECTED FEELING
        ===================================== */}

        {feeling && (

          <div className="selected-feeling">

            <span>

              Feeling:

              {" "}

              <strong>
                {feeling}
              </strong>

            </span>


            <button
              type="button"
              onClick={removeFeeling}
            >

              ✕

            </button>

          </div>

        )}


        {/* =====================================
            FILE INPUT
        ===================================== */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden-file-input"
          onChange={handleFileSelect}
        />


        {/* =====================================
            ACTIONS
        ===================================== */}

        <div className="post-actions">


          {/* ===================================
              PHOTO
          =================================== */}

          <button
            type="button"
            className="media-action-button"
            disabled={posting}
            onClick={() => {

              if (!fileInputRef.current) {
                return;
              }

              fileInputRef.current.accept =
                "image/*";

              fileInputRef.current.value = "";

              fileInputRef.current.click();

            }}
          >

            📷 Photo

          </button>


          {/* ===================================
              VIDEO
          =================================== */}

          <button
            type="button"
            className="media-action-button"
            disabled={posting}
            onClick={() => {

              if (!fileInputRef.current) {
                return;
              }

              fileInputRef.current.accept =
                "video/*";

              fileInputRef.current.value = "";

              fileInputRef.current.click();

            }}
          >

            🎥 Video

          </button>


          {/* ===================================
              FEELING
          =================================== */}

          <div
            className="feeling-wrapper"
            ref={feelingWrapperRef}
          >

            <button
              type="button"
              className="media-action-button"
              disabled={posting}
              onClick={() =>
                setShowFeelings(
                  (current) => !current
                )
              }
            >

              😊 Feeling

            </button>


            {/* FEELING MENU */}

            {showFeelings && (

              <div className="feeling-menu">

                {feelings.map(
                  (item) => (

                    <button
                      key={item}
                      type="button"
                      className={
                        feeling === item
                          ? "active-feeling"
                          : ""
                      }
                      onClick={() =>
                        selectFeeling(item)
                      }
                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* ===================================
              POST BUTTON
          =================================== */}

          <button
            type="button"
            className="post-button"
            onClick={createPost}
            disabled={posting}
          >

            {posting
              ? "Posting..."
              : "Post"}

          </button>


        </div>

      </div>

    </section>

  );

}

export default CreatePost;