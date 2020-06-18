import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';


import { Link } from 'react-router-dom';
import SinglePost from '../SinglePost'

import nameCard from "../../img/design/page2/namecard.png"
import request from "../../img/design/page2/request.PNG"
import matchedpeople from "../../img/design/page2/matchedpeople.PNG"

import './MyPage.css'



import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import { Button, ButtonGroup, CardContent } from '@material-ui/core';


firebase.analytics();

const styles = (theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  postHeader: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 0, 2),
  },
  inputArea: {
    paddingBottom: theme.spacing(4),
  },
  textInput: {
    marginLeft: theme.spacing(4),
    width: '90%',
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
});

const MyPage = (props) => {

  const { classes } = props;

  const { user } = props;
  const [followerList, setFollowerList] = useState([]);

  const [searchValue, setSearchValue] = useState('');

  const [changedPostList, setChangedPostList] = useState('');

  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [area, setArea] = useState('');
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  



//   const onSort = (e, standard = 'title') => {
//      e.preventDefault();
//      const sortResult = []
//      const queryUrl = `postlist/${country}`
//      const query = firebase.database().ref(queryUrl);
//      query.orderByChild(standard)
//        .once('value', function(snapshot) {
//          snapshot.forEach(function(childSnapshot) {
//            sortResult.push(childSnapshot.val());
//        })
//        setChangedPostList(sortResult.reverse());
//      });
//    }
//   const onChangeSearchValue = (e) => setSearchValue(e.target.value);
//   const onSearch = (e) => {
//     e.preventDefault();
//     const searchResult = postList.filter(post => post.title.indexOf(searchValue) !== -1);
//     setChangedPostList(searchResult);
//     setSearchValue('');
//   }

  useEffect(() => {
    setFollowerList([]);

    const query2 = firebase.database().ref(`users/${user.uid}/followers/`);

    const query = firebase.database().ref(`users/${user.uid}/info/`);


    query2.once("value")
				.then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          followerList.push(childSnapshot.val());
        })
        setFollowerList(followerList);
		})


    query.once("value")
      .then(function(snapshot) {
        if(snapshot.val()){
          setName(snapshot.val().name)
          setArea(snapshot.val().area)
          setText(snapshot.val().text)
          setEmail(snapshot.val().email)
  
        }
              
      })
  }, []);

  useEffect(() => {
		const storageRef = firebase.storage().ref();
		//storageRef.child(`${post.key}.jpg`).getDownloadURL().then(function(url) {
		storageRef.child(`${user.uid}.jpg`).getDownloadURL().then(function(url) {
			const imageLink = url;
			document.querySelector('img').src = imageLink;
  		}).catch(function(error) {
		});
  }, []);
    
  const accept = () => {
    alert('승낙되었습니다!')
    // firebase.database().ref().child(`users`).child(`${userUid}`).child(`follows`).update({ [`${post.userid}`]: `${post.useremail}`});


    //firebase.database().ref().child(`users`).child(`${user.uid}`).child(`matched`).update({ [`${userUid}`]: `${userEmail}`});
  }

  const reject = () => {

  }

  return (
    <React.Fragment>
      <main>
        <div className={classes.postHeader}>
          {/* <Container align="center"> */}
          {/* <img align="left" src="imageLink" height="250px" width="400px" align="center" style={{display:"block", margin: "0 auto"}}/>  */}

          <Container>
            <img align="left" src="imageLink" height="500px" width="400px" style={{display:"block", margin: "0 auto"}}/> 

            <Card>

              <CardHeader title="이름"/>
              <CardContent>{name}</CardContent>

              <CardHeader title="이메일"/>
              <CardContent>{email}</CardContent>
            
              <CardHeader title="분야"/>
              <CardContent>{area}</CardContent>

              <CardHeader title="자기소개"/>
              <CardContent className="mypage-introduce">{text}</CardContent>
            </Card>
            
            {/* <Typography>이름: {name}</Typography>
            <Typography>이메일: {email}</Typography>
            <Typography>분야: {area}</Typography> */}

            {/* <Grid>
              <Typography>자기소개</Typography>
              <div>{text}</div>
            </Grid> */}
            {/* <img src={nameCard} alt="banner-image" className="namecard"/>
            <img src={request} alt="banner-image" className="request"/>
            <img src={matchedpeople} alt="banner-image" className="matchedpeople"/> */}

          </Container>
        </div>

        <Container align="center">
            <Card>
              <CardHeader title="요청"/>
                <CardContent align="center">
                  {followerList &&
                     followerList.map(post => (
                      <div>
                        <span>{post}</span>
                        <ButtonGroup >
                          <Button onClick={()=>accept()} id={`${post}`} >승낙</Button>
                          <Button onClick={()=>reject()}>거절</Button>    
                        </ButtonGroup>
                      </div>
                  ))}
                </CardContent>
            </Card>

            <Card>
              <CardHeader title="매칭된 사람"/>
              <CardContent>김우영</CardContent>
            </Card>

        </Container>



      </main>


      <Link to={{
        pathname: "/mypageedit",
        state: {
          user: {
            uid: user.uid,
            email: user.email,
          },
        }
      }}>
        <Button align="center">
            프로필 수정하기
        </Button>
      </Link>


    </React.Fragment>
  )
}

export default withStyles(styles)(MyPage);
