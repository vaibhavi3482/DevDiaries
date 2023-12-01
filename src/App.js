import React, { useState, useEffect } from "react";
import Post from "./components/post/Post";
import "./App.css";
import { db, auth } from "./firebase/FirebaseInit";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import ImageUpload from "./components/imageUpload/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "rgba(255,255,255,1)",
    boxShadow: 24,
    padding: "30px 60px",
    borderRadius: "12px",
  },
  paper1: {
    position: "absolute",
    width: 600,
    backgroundColor: "rgba(255,255,255,1)",
    boxShadow: 24,
    padding: "30px 60px",
    borderRadius: "12px",
  }
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const [openPosts, setOpenPosts] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // create state to keep track of user
  const [user, setUser] = useState(null);

  // For authentication - Signup
  useEffect(() => {
    // listens to auth-based changes
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
        // function to keep the user logged in
      } else {
        // user has logged out

        setUser(null);
      }
    });
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // Everytime a new snapshot is noted (i.e. changes are made to posts in the database), this piece of code is fired
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));

    setOpenSignup(false);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const login = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenLogin(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="app">
      <Modal open={openSignup} onClose={() => setOpenSignup(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <div className="hed">
              <img
                className="app__headerlogo"
                src = "https://cdn-icons-png.flaticon.com/128/10259/10259824.png"
                alt="DevBlog logo"
              />
              <div className="app__headerlogoname">DevBlog</div>
            </div>
          </center>
          <form className="app__signUp">
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary__button" type="submit" onClick={signUp}>
              Sign up
            </button>
          </form>

          <center className="authFooter">
            <small>
              &copy; 2023 DevBlog by{" "}
              <a href="mailto:vaibhavimgandhi@gmail.com">Vaibhavi Gandhi</a>
            </small>
          </center>
        </div>
      </Modal>

      {/* Change modal open to be determined by openLogin */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <div className="hed">
              <img
                className="app__headerlogo"
                src = "https://cdn-icons-png.flaticon.com/128/10259/10259824.png"
                alt="DevBlog logo"
              />
              <div className="app__headerlogoname">DevBlog</div>
            </div>
          </center>
          <form className="app__signUp">
            <input
              placeholder="Email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="primary__button" type="submit" onClick={login}>
              Log in
            </button>
          </form>

          <center className="authFooter">
            <small>
              &copy; 2023 DevBlog by{" "}
              <a href="mailto:vaibhavimgandhi@gmail.com">Vaibhavi Gandhi</a>
            </small>
          </center>
        </div>
      </Modal>


      {/* For post  */}
      <Modal open={openPosts} onClose={() => setOpenPosts(false)}>
        <div style={modalStyle} className={classes.paper1}>
          <center>
            <ImageUpload user={user} setOpenPosts={setOpenPosts}/>
          </center>
        </div>
      </Modal>



      <div className="app__header">
        <div className="app__headerWrapper">
          <div className="hed">
          <img
            className="app__headerlogo"
            src = "https://cdn-icons-png.flaticon.com/128/10259/10259824.png"
            alt="DevBlog logo"
          />
          <div className="app__headerlogoname">DevBlog</div>
          </div>

          {user ? (
            <button className="text__button" onClick={() => auth.signOut()}>
              Logout
            </button>
          ) : (
            <div className="app__headerButtons">
              <button
                className="primary__button"
                onClick={() => {setOpenLogin(true); setOpenSignup(false);setOpenPosts(false);}}
              >
                Log in
              </button>
              <button
                className="text__button"
                onClick={() => {setOpenLogin(false); setOpenSignup(true);setOpenPosts(false);}}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div class="bg-image"></div>
      <div className="timeline">

        {/* If user variable is set then only we are allowing to upload the post */}
        {user && 
          (
            <button
                  className="primary__button"
                  onClick={() => {setOpenLogin(false); setOpenSignup(false);setOpenPosts(true);}}
                >
                  Create Post
            </button>
          )
        }

        {/* Mapping each posts one by one */}
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user} // To pass current user to add current user when adding comment # Useful while adding comments
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
