import React, { useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm, ResetPasswordForm, ChangePasswordForm, CreateAccountForm } from './components';
import Logo from './img/logo.png'
// eslint-disable-next-line import/no-anonymous-default-export
export default function () {





  return (

    <Switch className={'back-ground-denememe'} >

      <Route exact path='/login'  >



        <LoginPage />






      </Route>
      <Route exact path='/create-account' >
        <SingleCard title="LogIn">
          <CreateAccountForm />
        </SingleCard>
      </Route>
      <Route exact path='/reset-password' >
        <SingleCard
          title="Reset Password"
          description="Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
        >
          <ResetPasswordForm />
        </SingleCard>
      </Route>
      <Route exact path='/change-password/:recoveryCode' >
        <SingleCard title="Change Password">
          <ChangePasswordForm />
        </SingleCard>
      </Route>
      <Redirect to={'/login'} />
    </Switch>
  );
}


const LoginPage = () => {

  const [position, setPosition] = React.useState({});

  const canvasRef = useCanvas(([canvas, context]) => {
   
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles1 = [];
    const particles2 = [];
    
    function random (min, max) {
      return Math.random() * (max - min) + min;
    }
    
    function draw() {
      
      const particle1 = {
        x: canvas.width/2,
        y: canvas.height/2,
        xvel: Math.random() * 2,
        yvel: Math.random() * 2,
        color: `rgba(${random(254, 255)}, ${random(80, 160)}, ${random(50, 100)},${1.0/parseFloat(random(1,5))})`,
        size: Math.random()*30,
        rotate: parseInt(Math.random()*4),
        type: parseInt(Math.random()*4),
      };

      const particle2 = {
        x: canvas.width/2,
        y: canvas.height/2,
        xvel: Math.random() * 2,
        yvel: Math.random() * 2,
        color: `rgba(${random(224, 255)}, ${random(110, 251205)}, ${random(60, 80)})`,
        size: Math.random()*30,
      };
    
      particles1.push(parseInt(Math.random() * 8)===1 && particle1);
      particles2.push(parseInt(Math.random() * 5)===1 && particle2);
    
      if (particles1.length > 1000) {
        particles1.shift();

      }
      if (particles2.length > 500) {
        particles2.shift();
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
    
      for (let i = 0; i < particles1.length; i += 1){
      
        let drawIr = () =>{const p = particles1[i];
        
        
        //context.arc(p.x, p.y, p.size, 0, 2 * Math.PI, false);//(p.x, p.y, p.size, p.size);
        if(p.type===0){
          context.beginPath();
          context.arc(p.x, p.y, p.size/1.3,0,2*Math.PI);
          context.lineWidth=Math.random*2;
          context.strokeStyle = p.color;
          context.stroke();

          context.beginPath();
          context.arc(p.x, p.y, p.size/2,0,2*Math.PI);
          context.lineWidth=2;
          context.fillStyle = p.color;
          context.fill();
        }else if(p.type===1){
          
          context.beginPath();
          context.arc(p.x, p.y, p.size/2,0,2*Math.PI);
          context.lineWidth=2;
          context.fillStyle = p.color;
          context.fill();
        }else if(p.type===2){
          context.beginPath();
          context.arc(p.x, p.y, p.size/4,0,2*Math.PI);
          context.lineWidth= `${parseInt(Math.random*10)}`;
          context.strokeStyle = p.color;
          context.stroke();
        }else if(p.type===3){
          
          context.beginPath();
          context.arc(p.x, p.y, p.size/1,0,2*Math.PI);
          context.lineWidth=Math.random*2;
          context.strokeStyle = p.color;
          context.stroke();

          context.beginPath();
          context.arc(p.x, p.y, p.size/1.3,0,2*Math.PI);
          context.lineWidth=Math.random*2;
          context.strokeStyle = p.color;
          context.stroke();

          context.beginPath();
          context.arc(p.x, p.y, p.size/1.7,0,2*Math.PI);
          context.lineWidth=Math.random*2;
          context.strokeStyle = p.color;
          context.stroke();

          context.beginPath();
          context.arc(p.x, p.y, p.size/2,0,2*Math.PI);
          context.lineWidth=Math.random*2;
          context.strokeStyle = p.color;
          context.stroke();

          context.beginPath();
          context.arc(p.x, p.y, p.size/2.5,0,2*Math.PI);
          context.lineWidth=Math.random*2;
          context.fillStyle = p.color;
          context.fill();
        }

        if(p.rotate===0){
          p.x += p.xvel;
          p.y += p.yvel;
        }else if(p.rotate===1){
          p.x -= p.xvel;
          p.y -= p.yvel;
        }else if(p.rotate===2){
          p.x -= p.xvel;
          p.y += p.yvel;
        }else if(p.rotate===3){
          p.x += p.xvel;
          p.y -= p.yvel;
        }

        p.size = p.size+0.1;
      }

        particles1[i] && drawIr();
      }

      // for (let i = 0; i < particles2.length; i += 1){
      //   let drawIr = () =>{
      //     const p = particles2[i];
      //     context.fillStyle = p.color;
      //     context.beginPath();
      //     context.arc(p.x, p.y, p.size/2,0,2*Math.PI);
       
      //     context.fill();
      //     p.x -= p.xvel;
      //     p.y -= p.yvel;}

      //   particles2[i] && drawIr();
      // }
    
      window.requestAnimationFrame(draw);
    }

    
    
    window.requestAnimationFrame(draw);



  });


  return (
    <React.Fragment>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}></canvas>
      <SingleCard title={<div style={{marginLeft:'18%'}}><img src={Logo}></img><div>Kullanıcı Girişi</div></div>}  >
        
        <LoginForm />
      </SingleCard>
    </React.Fragment>

  )
}

const useCanvas = (callback) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    callback([canvas, ctx]);
  }, [window.innerWidth]);

  return canvasRef;
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));