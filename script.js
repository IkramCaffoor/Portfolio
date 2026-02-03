// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Remove loader after 3 seconds
    setTimeout(() => {
        const loader = document.getElementById('terminal-loader');
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 3000);

    // Matrix Canvas Effect
    const matrixCanvas = document.getElementById('matrixCanvas');
    const matrixCtx = matrixCanvas.getContext('2d');
    
    // Set canvas size
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    // Matrix characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;
    
    // Raindrops for each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * matrixCanvas.height / fontSize);
    }
    
    // Matrix effect
    function drawMatrix() {
        // Semi-transparent black rectangle for trail effect
        matrixCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = "#00FF66";
        matrixCtx.font = fontSize + "px 'Share Tech Mono'";
        
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Draw character
            matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Reset drop if it reaches bottom or randomly
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Move drop down
            drops[i]++;
        }
    }

    // Network Canvas Effect
    const networkCanvas = document.getElementById('networkCanvas');
    const networkCtx = networkCanvas.getContext('2d');
    
    networkCanvas.width = window.innerWidth;
    networkCanvas.height = window.innerHeight;
    
    let nodes = [];
    const nodeCount = 80;
    const mouse = { x: null, y: null };
    
    // Create nodes
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = `rgba(0, 255, 102, ${Math.random() * 0.5 + 0.2})`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off walls
            if (this.x <= 0 || this.x >= networkCanvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= networkCanvas.height) this.vy *= -1;
            
            // Attract to mouse
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.vx += dx * 0.0001;
                    this.vy += dy * 0.0001;
                }
            }
        }
        
        draw() {
            networkCtx.beginPath();
            networkCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            networkCtx.fillStyle = this.color;
            networkCtx.fill();
        }
    }
    
    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node(
            Math.random() * networkCanvas.width,
            Math.random() * networkCanvas.height
        ));
    }
    
    // Draw connections between nodes
    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    networkCtx.beginPath();
                    networkCtx.strokeStyle = `rgba(0, 255, 102, ${0.15 * (1 - distance / 150)})`;
                    networkCtx.lineWidth = 0.5;
                    networkCtx.moveTo(nodes[i].x, nodes[i].y);
                    networkCtx.lineTo(nodes[j].x, nodes[j].y);
                    networkCtx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animate);
    }
    
    // Start animations
    setInterval(drawMatrix, 50);
    animate();
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Window resize handling
    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        networkCanvas.width = window.innerWidth;
        networkCanvas.height = window.innerHeight;
    });
    
    // Typewriter effect for terminal
    const typewriter = document.querySelector('.typewriter');
    const lines = [
        "> whoami",
        "Ikram Caffoor - Cybersecurity Specialist",
        "> system_status",
        "[✓] Offensive Security [✓] Network Defense [✓] Threat Analysis",
        "> bio",
        "Cybersecurity enthusiast with focus on red teaming, penetration testing, and CTF challenges. Passionate about OSINT, research, and continuous learning in the evolving security landscape. Athletic mindset applied to ethical hacking: discipline, strategy, persistence."
    ];
    
    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function typeEffect() {
        const currentLine = lines[lineIndex];
        const cursor = document.querySelector('.cursor');
        
        if (!isDeleting && charIndex <= currentLine.length) {
            // Typing
            if (charIndex === currentLine.length) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    typeEffect();
                }, 1500);
                return;
            }
            
            cursor.insertAdjacentText('beforebegin', currentLine[charIndex]);
            charIndex++;
            setTimeout(typeEffect, Math.random() * 30 + 20);
        } else if (isDeleting && charIndex >= 0) {
            // Deleting
            if (charIndex === 0) {
                isDeleting = false;
                lineIndex = (lineIndex + 1) % lines.length;
                const outputElement = document.createElement('p');
                outputElement.className = lineIndex % 2 === 0 ? 'command' : 'output';
                if (lineIndex % 2 !== 0) outputElement.style.marginLeft = '20px';
                typewriter.insertBefore(outputElement, cursor);
                setTimeout(typeEffect, 500);
                return;
            }
            
            const text = cursor.previousSibling;
            text.textContent = text.textContent.slice(0, -1);
            charIndex--;
            setTimeout(typeEffect, Math.random() * 20 + 10);
        } else {
            setTimeout(typeEffect, 100);
        }
    }
    
    // Start typewriter after loader
    setTimeout(typeEffect, 3500);
    
    // Skill cards interaction
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
    
    // Tab functionality for hobbies
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });
    
    // Modal functionality for certificates
    const modal = document.getElementById('certModal');
    const certButtons = document.querySelectorAll('.cert-view');
    const closeModal = document.querySelector('.modal-close');
    const certFrame = document.getElementById('certFrame');
    
    certButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            
            const pdfPath = this.dataset.pdf;
            if (pdfPath) {
                certFrame.src = pdfPath;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        certFrame.src = '';
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            certFrame.src = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Form submission
    const contactForm = document.getElementById('cyber-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // In a real implementation, this would be the fetch() call
            console.log('Form submitted');
            
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> MESSAGE SENT!';
            submitBtn.style.background = 'linear-gradient(45deg, #00cc52, #009933)';
            
            // Reset form after 2 seconds
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = 'linear-gradient(45deg, var(--primary), var(--primary-dark))';
            }, 2000);
        }, 1500);
    });
    
    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add glitch effect randomly
    setInterval(() => {
        if (Math.random() > 0.7) {
            const glitch = document.querySelector('.glitch');
            glitch.style.animation = 'none';
            setTimeout(() => {
                glitch.style.animation = 'glitch 5s infinite';
            }, 100);
        }
    }, 3000);
    
    // Add random terminal-like effects
    function randomTerminalEffect() {
        const effects = [
            () => {
                const terminal = document.querySelector('.cyber-terminal');
                terminal.style.boxShadow = '0 0 30px #ff0033';
                setTimeout(() => {
                    terminal.style.boxShadow = '0 0 20px var(--primary)';
                }, 100);
            },
            () => {
                const scanline = document.querySelector('.scanline');
                scanline.style.background = 'linear-gradient(to right, transparent, #ff0033, transparent)';
                setTimeout(() => {
                    scanline.style.background = 'linear-gradient(to right, transparent, var(--primary), transparent)';
                }, 200);
            },
            () => {
                document.querySelectorAll('.skill-card').forEach(card => {
                    if (Math.random() > 0.5) {
                        card.style.borderColor = '#ff0033';
                        setTimeout(() => {
                            card.style.borderColor = '';
                        }, 300);
                    }
                });
            }
        ];
        
        if (Math.random() > 0.8) {
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            randomEffect();
        }
    }
    
    setInterval(randomTerminalEffect, 5000);
    
    // Add particle effect on click
    document.addEventListener('click', function(e) {
        const particles = 15;
        for (let i = 0; i < particles; i++) {
            createParticle(e.clientX, e.clientY);
        }
    });
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = '#00ff66';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9998';
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let opacity = 1;
        function animateParticle() {
            x += vx;
            y += vy;
            opacity -= 0.02;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        animateParticle();
    }
    
    // Add sound effects (optional - uncomment if you want sounds)

    const hoverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
    const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-plastic-bubble-click-1124.mp3');
    
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });
        
        element.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });

});











