import React, { useState, useRef } from "react";
import { storage, db, fb } from "../../firebase/FirebaseInit";
import "./ImageUpload.css";
import { Editor } from '@tinymce/tinymce-react';

function ImageUpload({ user, setOpenPosts }) {

  // Setting up image State variable for uploading the image
  const [image, setImage] = useState(null);
  // Progress bar on the scale 0 to 100 for uploading
  const [progress, setProgress] = useState(0);
  // Caption for the post-upload
  const [caption, setCaption] = useState("");

  const editorRef = useRef(null);

  // Function to set the imageupload variable
  const handleChange = (e) => {
    if (e.target.files[0]) {
      // Index 0 because multiple files can be selected at once and we want the single file which was selected at first
      setImage(e.target.files[0]);
    }
  };


  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        // Error function
        console.log(err);
        alert(err.message);
      },
      () => {
        // Complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // Post image inside db
            db.collection("posts").add({
              timestamp: fb.firestore.FieldValue.serverTimestamp(),
              // caption: caption,
              caption: editorRef.current.getContent(),
              imageUrl: url,
              username: user.displayName,
            });

            setProgress(0);
            setCaption("");
            setImage(null);
            setOpenPosts(false);
          });
      }
    );
    // setOpenPosts(false);
  };

  return (
    <div className="imageUpload">
      {/* <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      /> */}
      {/* <textarea
        type="content"
        placeholder="Enter a caption..."
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      >
      </textarea> */}
      <Editor
        apiKey='9jeo5y330io82dx1sju5u7s8gmhv22ensbwdhciz3xkj2vcc'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue="<p>Enter the description...</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <progress className="progress" value={progress} max="100" />
      <div className="uploadCapBtn">
        <input className="uploadCap" type="file" onChange={handleChange} />
        <button className="primary__button uploadBtn" onClick={handleUpload}>
          Post
        </button>
      </div>
    </div>
  );
}

export default ImageUpload;
