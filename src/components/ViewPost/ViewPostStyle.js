import React, { Component, useState, useEffect } from 'react';
import moment from 'moment';

import renderHTML from 'react-render-html';
import {IconButton, TextField, CardHeader, CardMedia, CardContent, CardActions, Avatar, Container, Paper, Divider, Textfield, Input, FormControl, Button, ButtonGroup, InputLabel, Typography, Grid, Card, OutlinedInput} from '@material-ui/core/';
import { makeStyles, withStyles} from '@material-ui/styles';
import AddCommentIcon from '@material-ui/icons/AddComment';

import clsx from 'clsx';
import FollowButton from './FollowButton';
import LikeButton from './LikeButton'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/functions';


const styles = (theme) => ({
    postHeader: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 0, 2),
    },
    title:{
        padding: '10px',
    },
    card:{
        height:'100%',
        display: 'flex',
        flexDirection: 'column',
    },
    reply:{
        display:'flex',
        flexDirection:'column'
    },
    enterReply:{

    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
})

class Reply extends Component {
}

//key를 다르게 받아서 가져올지,

const ShowPost = (props) => {
	console.log(props);


	//////////////Get currentPostKey////////////
	const [postKey, setPostKey]= useState('');

	useEffect(() => {
			const query = firebase.database().ref().child('currentPost');
			query.once("value")
				.then(function(snapshot) {
				setPostKey(snapshot.val().key);

				firebase.database().ref().child(`postlist`).child(`seoul`).child(`${snapshot.val().key}`).on("value", function(childSnap){
						//console.log(childSnap.val());
						setTitleData(childSnap.val().title);
						setTextData(childSnap.val().text);
						setEmailData(childSnap.val().useremail);
						setDateData(childSnap.val().date);
						setLikeData(childSnap.val().like);
				});


				})
	}, []);

	//console.log(postKey);
	///////////////////////////////////////////


	const [titleData, setTitleData] = useState('');
	const [textData, setTextData] = useState('');
	const [dateData, setDateData] = useState('');
	const [likeData, setLikeData] = useState('');
	const [emailData, setEmailData] = useState('');


	const { classes } = props;
	const [favorite, setFavorite] = useState(0);
	const [newReply, setNewReply] = useState('');
	const [replyList, setReplyLIst] = useState('')

	const AddReply = (e) => {
			e.preventdefault();
			if(!newReply) {
					return alert ("Type your reply!");
			}
	}

	const addComment = (e) =>{
		e.preventDefault();
		firebase.database().ref().child(`postlist`).child(`seoul`).child(`${postKey}`).child('comment').update({ [Date(Date.now()).toString()] : `${newReply}` });
		document.getElementById('comment-form').reset();;
	}

	const Like = () => {
		//e.preventdefault();
		firebase.database().ref().child(`postlist`).child(`seoul`).child(`${postKey}`).on("value", function(childSnap){
			firebase.database().ref().child(`postlist`).child(`seoul`).child(`${postKey}`).update({ like: `${childSnap.val().like=+1}`});
			console.log(childSnap.val().like);
		})

		document.getElementById('like-button').disabled = true;

	}


	const Follow = () => {
		//e.preventdefault();
		firebase.database().ref().child(`users`).child(`${props.user.uid}`).child(`follows`).update({ email: `${emailData}`});
		console.log(`${emailData}`);
	}

	/*useEffect(() => {
		firebase.database().ref().child(`users`).child(`${props.user.uid}`).child(`follows`).update({ email: `${emailData}`});
	})*/

	return(
		<React.Fragment>
			<main style={{align: 'center'}}>
			<Container maxWidth={false} className={classes.postHeader}>
				<Typography component="h1" variant="h5" align="left" color="textPrimary">
					{postKey.countryName} 여행 게시판
				</Typography>
			</Container>
			<Container className={classes.card}>
				<Card>
					<CardHeader
						align = 'center'
						title = {titleData}
						subheader={`작성자: ${emailData}, 작성시간: ${dateData}`}
					/>
					<CardMedia
						className = {classes.media}
						image = "https://image.freepik.com/free-photo/beautiful-architecture-building-cityscape-seoul-city_74190-3218.jpg"
						title = "Seoul"
					/>
					<CardContent align = 'right'>
						<ButtonGroup >
							<Button id="like-button" onClick={()=>Like()}>Like</Button>
							<Button onClick={()=>Follow()}>Follow</Button>
						</ButtonGroup>
					</CardContent>
					<Divider light/>
					<CardContent align = 'left'>
							<pre>{textData}</pre>
					</CardContent>
					<Divider light/>
				</Card>
			</Container>
			<Container className={classes.reply}>
				<h4>댓글</h4>
				<Paper>
					<Divider light/>
					<div>
					<span><b>이름:  </b></span>
					<span>내용 내용</span>
					<span style={{float:'right'}}>날짜</span>
					</div>
					<Divider light/>
					<div>
					<span><b>이름:  </b></span>
					<span>내용 내용</span>
					<span style={{float:'right'}}>날짜</span>
					</div>
				</Paper>
				<Divider/>
			</Container>
			<Container>
					<form id="comment-form" onSubmit={AddReply} align = 'center'>
							<p><TextField id="commentTextfield" type = "text" placeholder = "댓글을 남겨주세요." onChange={(e) => setNewReply(e.target.value)} style={{width:'85%'}}/>
							{'   '}
							<Button type = "submit" onClick={(e)=>addComment(e)} variant="contained" color="primary" endIcon={<AddCommentIcon/>}>Add</Button>
							</p>
					</form>
			</Container>
			</main>
		</React.Fragment>
	)
}

export default withStyles(styles) (ShowPost);
