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

  // Controls Feeling dropdown separately
  const [showFeelings, setShowFeelings] = useState(false);

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
  // CLOSE FEELING MENU WHEN CLICKING OUTSIDE
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

    if (!selectedFile) return;

    const isImage =
      selectedFile.type.startsWith("image/");

    const isVideo =
      selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {

      alert(
        "Please select an image or video file."
      );

      return;
    }

    setFile(selectedFile);

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

    // IMPORTANT:
    // Close dropdown immediately
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

    if (
      !caption.trim() &&
      !file &&
      !feeling
    ) {

      alert(
        "Write something or select media first."
      );

      return;
    }

    try {

      setPosting(true);

      const formData =
        new FormData();

      formData.append(
        "caption",
        caption.trim()
      );

      if (file) {

        formData.append(
          "file",
          file
        );

      }

      if (feeling) {

        formData.append(
          "feeling",
          feeling
        );

      }

      const response =
        await api.post(
          "/posts",
          formData
        );

      // Reset everything
      setCaption("");
      setFile(null);
      setFeeling("");
      setSelectedType("");
      setShowFeelings(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

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

      alert(
        error.response?.data ||
        "Failed to create post"
      );

    } finally {

      setPosting(false);

    }
  };


  // =========================================
  // AVATAR
  // =========================================

  const avatar =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.username?.charAt(0)?.toUpperCase() ||
    "U";


  // =========================================
  // UI
  // =========================================

  return (
    <section className="create-post">

      {/* =========================
          AVATAR
      ========================= */}

      <div className="avatar">
        {avatar}
      </div>


      <div className="post-input-area">

        {/* =========================
            CAPTION
        ========================= */}

        <textarea
          placeholder="What's happening?"
          value={caption}
          onChange={(e) =>
            setCaption(e.target.value)
          }
          maxLength={1000}
        />


        {/* =========================
            SELECTED MEDIA
        ========================= */}

        {file && (

          <div className="selected-media">

            <div>

              {selectedType === "VIDEO"
                ? "🎥"
                : "📷"}

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


        {/* =========================
            SELECTED FEELING
        ========================= */}

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


        {/* =========================
            FILE INPUT
        ========================= */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden-file-input"
          onChange={handleFileSelect}
        />


        {/* =========================
            ACTIONS
        ========================= */}

        <div className="post-actions">


          {/* PHOTO */}

          <button
            type="button"
            className="media-action-button"
            onClick={() => {

              if (fileInputRef.current) {

                fileInputRef.current.accept =
                  "image/*";

                fileInputRef.current.click();

              }

            }}
          >
            📷 Photo
          </button>


          {/* VIDEO */}

          <button
            type="button"
            className="media-action-button"
            onClick={() => {

              if (fileInputRef.current) {

                fileInputRef.current.accept =
                  "video/*";

                fileInputRef.current.click();

              }

            }}
          >
            🎥 Video
          </button>


          {/* =========================
              FEELING
          ========================= */}

          <div
            className="feeling-wrapper"
            ref={feelingWrapperRef}
          >

            <button
              type="button"
              className="media-action-button"
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

                {feelings.map((item) => (

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

                ))}

              </div>

            )}

          </div>


          {/* =========================
              POST BUTTON
          ========================= */}

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