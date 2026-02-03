document.addEventListener('DOMContentLoaded', function() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    
    let startX;
    let startY;
    const threshold = 10; 

    skillItems.forEach(item => {
       
        item.addEventListener('mousedown', function(e) {
            startX = e.clientX;
            startY = e.clientY;
        });

       
        item.addEventListener('mouseup', function(e) {
            const endX = e.clientX;
            const endY = e.clientY;

           
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

            
            if (distance < threshold) {
                const targetId = this.getAttribute('data-target');
                const targetDetails = document.getElementById(targetId);

               
                document.querySelectorAll('.skill-details').forEach(details => {
                    if (details !== targetDetails) {
                        details.classList.remove('visible');
                    }
                });

              
                targetDetails.classList.toggle('visible');
            }
        });
    });
});

document.querySelectorAll('.view-cert').forEach(button => {
  button.addEventListener('click', () => {
    const certUrl = button.dataset.cert;
    if(certUrl) {
      window.open(certUrl, '_blank'); 
    } else {
      alert('Certificate file not found!');
    }
  });
});

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let nodes = [];
const staticNodesCount = 60;
for (let i = 0; i < staticNodesCount; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    alpha: 1 
  });
}


let mouseNodes = [];
const maxMouseNodes = 20; 
document.addEventListener("mousemove", e => {
  if(mouseNodes.length < maxMouseNodes){
    mouseNodes.push({ x: e.clientX, y: e.clientY, vx: 0, vy: 0, alpha: 1 });
  }
});

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  
  const allNodes = [...nodes, ...mouseNodes];


  for (let node of allNodes) {
    node.x += node.vx;
    node.y += node.vy;

    
    if(node.x < 0 || node.x > canvas.width) node.vx *= -1;
    if(node.y < 0 || node.y > canvas.height) node.vy *= -1;

    ctx.beginPath();
    ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,100,${node.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#0f0";
    ctx.fill();
  }

 
  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      let dx = allNodes[i].x - allNodes[j].x;
      let dy = allNodes[i].y - allNodes[j].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100){
        ctx.beginPath();
        ctx.moveTo(allNodes[i].x, allNodes[i].y);
        ctx.lineTo(allNodes[j].x, allNodes[j].y);
        ctx.strokeStyle = `rgba(0,255,100,0.12)`; 
        ctx.stroke();
      }
    }
  }

 
  mouseNodes = mouseNodes.map(node => ({ ...node, alpha: node.alpha - 0.02 }))
                         .filter(node => node.alpha > 0); 

  requestAnimationFrame(draw);
}

draw();


window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


const typewriter = document.querySelector(".typewriter");
const text = typewriter.textContent;
typewriter.textContent = "";

const cursor = document.createElement("span");
cursor.classList.add("cursor");
cursor.textContent = "|";
typewriter.appendChild(cursor);

let i = 0;
const speed = 10; 

function type() {
  if(i < text.length) {
    cursor.insertAdjacentText("beforebegin", text.charAt(i));
    i++;
    setTimeout(type, speed);
  }
}

type();


document.querySelector(".contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = document.querySelector(".contact-form");
    const formData = new FormData(form); // includes access_key + inputs

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Thank you! Your message has been sent successfully.");
            form.reset();
        } else {
            alert("Error: " + data.message);
            console.error(data);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error submitting the form.");
    });
});


document.querySelectorAll('.hobby h3').forEach(header => {
  header.addEventListener('click', () => {
    const hobby = header.parentElement;

  
    hobby.classList.toggle('active');

    
    document.querySelectorAll('.hobby').forEach(other => {
      if (other !== hobby) other.classList.remove('active');
    });

  
    if (hobby.classList.contains('active')) {
      hobby.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});











