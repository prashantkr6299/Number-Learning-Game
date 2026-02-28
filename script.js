let current = 1, maxNumber = 10, score = 0, quizAnswer = 0, direction = "forward";
    let colors = ["red", "blue", "green", "purple", "orange", "pink"];
    let appreciationMessages = ["🌟 Amazing!","👏 Well done!","🎉 Fantastic!","💖 Great job!","✨ Excellent!","👍 Keep it up!","🥳 You did it!","💫 Super!","🌈 Wonderful!"];
    let classroomMode = false, students = [], currentStudentIndex = 0, quizQuestions = 0, currentQuiz = 0, attempts = 0, maxAttempts = 2;

    const numberDisplay = document.getElementById("number");
    const appreciation = document.getElementById("appreciation");
    const scoreEl = document.getElementById("score");

    // Convert number to words (1-99)
    function numberToWords(n) {
      const ones = ["", "one","two","three","four","five","six","seven","eight","nine"];
      const teens = ["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
      const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
      if(n<10) return ones[n];
      else if(n<20) return teens[n-10];
      else { let t = Math.floor(n/10), o = n%10; return tens[t]+(o>0?" "+ones[o]:""); }
    }

    function speak(text) {
      let s = new SpeechSynthesisUtterance(text);
      s.lang = "en-US";
      window.speechSynthesis.speak(s);
    }

    function updateNumber() {
      numberDisplay.innerText = current;
      numberDisplay.style.color = colors[Math.floor(Math.random()*colors.length)];
      numberDisplay.style.transform = "scale(1.1)";
      setTimeout(()=>numberDisplay.style.transform="scale(1)",200);
      speak(numberToWords(current));

      if(direction==="forward" && current===maxNumber){
        appreciation.innerText = "🎉 Great! Now practice in reverse. Click Reverse ⬅️";
        document.getElementById("nextBtn").style.display="none";
        document.getElementById("reverseBtn").style.display="inline-block";
      }
      if(direction==="reverse" && current===1){
        appreciation.innerText="🎉 Fantastic! You completed reverse. Click Quiz Mode!";
        document.getElementById("reverseBtn").style.display="none";
        document.getElementById("nextBtn").style.display="inline-block";
      }
    }

    // Navigation
    document.getElementById("prevBtn").onclick=()=>{if(current>1)current--;updateNumber();};
    document.getElementById("nextBtn").onclick=()=>{if(current<maxNumber)current++;updateNumber();};
    document.getElementById("reverseBtn").onclick=()=>{direction="reverse";current--;updateNumber();};

    // Celebrations
    function celebrate(){for(let i=0;i<12;i++){let b=document.createElement("div");b.className="balloon";b.innerHTML="🎈";b.style.left=Math.random()*100+"vw";b.style.color=colors[Math.floor(Math.random()*colors.length)];document.body.appendChild(b);setTimeout(()=>b.remove(),5000);}}
    function createStar(){let s=document.createElement("div");s.className="star";s.innerHTML="⭐";s.style.left=Math.random()*100+"vw";document.body.appendChild(s);setTimeout(()=>s.remove(),6000);}
    setInterval(createStar,1000);

    // Mode selection
    document.getElementById("individualModeBtn").onclick=()=>{
      document.querySelector(".mode-buttons").style.display="none";
      document.getElementById("individualSetup").style.display="block";
      classroomMode=false;
    };
    document.getElementById("classroomModeBtn").onclick=()=>{
      document.querySelector(".mode-buttons").style.display="none";
      document.getElementById("classroomSetup").style.display="block";
      classroomMode=true;
    };

    document.getElementById("startIndividualBtn").onclick=()=>{
      let name=document.getElementById("playerName").value||"Player";
      maxNumber=parseInt(document.getElementById("maxNumber").value)||10;
      students=[{name:name,score:0,maxNumber:maxNumber,quizQuestions:0}];
      currentStudentIndex=0;
      document.getElementById("individualSetup").style.display="none";
      startLearning();
    };

 document.getElementById("startLearningClassBtn").onclick=()=>{
  let name = document.getElementById("classStudentName").value.trim();
  maxNumber = parseInt(document.getElementById("classMaxNumber").value) || 10;

  

  if(name === ""){
    alert("Please enter student name before starting.");
    return;
  }

  students = [{name:name, score:0, maxNumber:maxNumber, quizQuestions:0}];
  currentStudentIndex = 0;

  document.getElementById("classroomSetup").style.display="none";
  startLearning();
 };

    function startLearning(){
      score=0; attempts=0; current=1; direction="forward";
      document.getElementById("gameBox").style.display="block";
      updateNumber();
      document.getElementById("quizBox").style.display="none";
      document.getElementById("score").style.display="none";
    }

    // Quiz Mode
    document.getElementById("quizBtn").onclick=()=>{
      document.getElementById("quizBox").style.display="block";
      document.getElementById("quizControls").style.display="none";
      if(classroomMode){
        document.getElementById("quizSetup").innerHTML=`<label>Enter number of students for quiz:</label>
        <input type="number" id="quizNumStudents" placeholder="Students"><br>
        <label>Enter number of questions per student:</label>
        <input type="number" id="quizNumQuestions" placeholder="Questions"><br>
        <button id="startClassQuizBtn">Start Quiz</button>`;
        document.getElementById("startClassQuizBtn").onclick=startClassQuiz;
      } else {
        document.getElementById("quizSetup").innerHTML=`<label>Enter number of quiz questions:</label>
        <input type="number" id="individualQuizCount" placeholder="Questions"><br>
        <button id="startIndividualQuizBtn">Start Quiz</button>`;
        document.getElementById("startIndividualQuizBtn").onclick=startIndividualQuiz;
      }
    };

    function startIndividualQuiz(){
      quizQuestions=parseInt(document.getElementById("individualQuizCount").value)||5;
      currentQuiz=0; score=0;
      document.getElementById("quizControls").style.display="block";
      document.getElementById("score").style.display="inline-block";
      nextQuizQuestion();
    }

    function startClassQuiz(){
      let n=parseInt(document.getElementById("quizNumStudents").value)||1;
      let q=parseInt(document.getElementById("quizNumQuestions").value)||5;
      students=[]; currentStudentIndex=0;
      for(let i=0;i<n;i++) students.push({name:"",score:0,maxNumber:maxNumber,quizQuestions:q});
      promptStudentName();
    }

    function promptStudentName(){
      document.getElementById("quizSetup").innerHTML=`<label>Enter name for Student ${currentStudentIndex+1}:</label>
      <input type="text" id="studentQuizName" placeholder="Student Name">
      <button id="startStudentQuizBtn">Start Quiz</button>`;
      document.getElementById("startStudentQuizBtn").onclick=startStudentQuiz;
    }

    function startStudentQuiz(){
      students[currentStudentIndex].name = document.getElementById("studentQuizName").value || `Student ${currentStudentIndex+1}`;
      score=0; currentQuiz=0;
      document.getElementById("quizControls").style.display="block";
      document.getElementById("score").style.display="inline-block";
      nextQuizQuestion();
    }

    function nextQuizQuestion(){
      let student=students[currentStudentIndex];
      if(classroomMode) quizQuestions=student.quizQuestions;
      if(currentQuiz>=quizQuestions){
        if(classroomMode){
          student.score=score;
          currentStudentIndex++;
          if(currentStudentIndex<students.length) promptStudentName();
          else showResults();
        } else {
          students[0].score=score;
          showResults();
        }
        return;
      }
      quizAnswer=Math.floor(Math.random()*maxNumber)+1;
      document.getElementById("question").innerText = `Question ${currentQuiz+1}: What number am I saying?`;
      document.getElementById("answer").value="";
      attempts=0;
      currentQuiz++;
      document.getElementById("quizSetup").innerHTML="";
      appreciation.innerText="";
      speak(numberToWords(quizAnswer));
    }

    // Submit answer
    document.getElementById("submitAnswerBtn").onclick=function(){
      let ans=parseInt(document.getElementById("answer").value);
      attempts++;
      if(ans===quizAnswer){
        score++;
        appreciation.innerText=appreciationMessages[Math.floor(Math.random()*appreciationMessages.length)];
        scoreEl.innerText="Score: "+score;
        celebrate();
        nextQuizQuestion();
      } else if(attempts<maxAttempts){
        appreciation.innerText="Try again";
        speak("Try again");
      } else {
        appreciation.innerText="Skipped! Moving to next.";
        speak("Skipped! Moving to next.");
        nextQuizQuestion();
      }
    };

    // Listen Again button
    document.getElementById("listenBtn").onclick=function(){
      speak(numberToWords(quizAnswer));
    };

    // Show Results
    function showResults(){
      document.getElementById("gameBox").style.display="none";
      document.getElementById("quizBox").style.display="none";
      document.getElementById("resultsTable").style.display="block";

      const tbody=document.getElementById("resultsBody");
      tbody.innerHTML="";

      students.forEach(student=>{
        const row=document.createElement("tr");
        row.innerHTML = `<td>${student.name}</td><td>${student.score}</td>`;
        tbody.appendChild(row);
      });

      if(classroomMode){
        let maxScore=Math.max(...students.map(s=>s.score));
        let topStudents=students.filter(s=>s.score===maxScore).map(s=>s.name).join(", ");
       document.getElementById("topStudents").innerText = `🏆 Top Student(s): ${topStudents} with ${maxScore} points`;
      } else {
        document.getElementById("topStudents").innerText=`Your Score: ${students[0].score}/${quizQuestions}`;
      }
    }

    document.getElementById("restartBtn").onclick=function(){location.reload();};
