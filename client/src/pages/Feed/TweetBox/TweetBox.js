import React, { useState } from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from "axios";
// import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedInUser from "../../../Hooks/useLoggedInUser";
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../../../firebase.init'

function TweetBox() {
    const [post, setPost] = useState('')
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState(' ');
    const [loggedInUser] = useLoggedInUser();
    const [ user ] = useAuthState(auth);
    const email = user?.email;

    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"

    // console.log(user?.providerData[0]?.providerId);

    const handleUploadImage = e => {
        setIsLoading(true);
        const image = e.target.files[0];

        const formData = new FormData();
        formData.set('image', image);

        axios.post("https://api.imgbb.com/1/upload?key=00a4bb2e713dc89ddd0ba7bc1839bf66", formData)
            .then(res => {
                setImageURL(res.data.data.display_url);
                // console.log(res.data.data.display_url);
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            })
    }

    const handleTweet = (e) => {
        e.preventDefault();
        // console.log(user)
        if(user.providerData[0]?.providerId === 'password') {
            fetch(`https://buzzvibe-social-media-backend.onrender.com/loggedInUser?email=${email}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setName(data[0]?.name);
                setUsername(data[0]?.username);
            })
        } else {
            setName(user?.displayName)
            setUsername(email?.split('@')[0])
        }
        if(name) {
            const userPost = {
                profilePhoto: userProfilePic,
                post: post,
                photo: imageURL,
                username: username,
                name: name,
                email: email,
            }
            // console.log(userPost);
            setPost('')
            setImageURL('')
            fetch('https://buzzvibe-social-media-backend.onrender.com/post', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userPost),
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                })
        }
    }

    return (
        <div className="tweetBox rounded-bl-[20px] rounded-br-[20px] mb-5 bg-[#1b1b1b]">
            <form onSubmit={handleTweet}>
                <div className="tweetBox__input">
                    <Avatar src={userProfilePic}></Avatar>
                    <input
                        type="text"
                        placeholder="What's happening?"
                        onChange={(e) => setPost(e.target.value)}
                        value={post}
                        required
                        className="bg-[#1f262c] py-3 px-6 rounded-[30px]"
                    />

                </div>
                <div className="flex justify-between">
                    <div className="flex flex-row gap-2 items-center text-[#d9d9d9]">
                        <label htmlFor='image' className="imageIcon">
                            {
                                isLoading ? <p>Uploading Image</p> : <p>{imageURL ? 'Image Uploaded' : <>  <div className="flex flex-row gap-2 items-center text-[#d9d9d9]"><AddPhotoAlternateOutlinedIcon className="text-[16px]"/> <h3 className="text-[20px]">Image</h3> </div></>}</p>
                            }
                        </label>
                        <input type="file" id='image' className="imageInput" onChange={handleUploadImage} />
                        
                    </div>
                    
                    <Button className="tweetBox__tweetButton bg-[#4285F4] border-none text-white font-[700] rounded-[50px] w-[100px] h-[40px] mr-[20px]" type="submit">Tweet</Button>
                </div>
            </form>
        </div>
    );
}
export default TweetBox;