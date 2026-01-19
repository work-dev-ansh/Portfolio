// ===== DOM Elements =====
const cursorGlow = document.getElementById('cursorGlow');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const typingText = document.getElementById('typingText');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatSuggestions = document.getElementById('chatSuggestions');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ===== Cursor Glow Effect =====
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// ===== Active Navigation Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Typing Effect =====
const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Problem Solver',
    'Backend Specialist',
    'React Developer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
typeEffect();

// ===== Chatbot Functionality =====
const chatResponses = {
    'progress': {
        message: `📊 <strong>Your Learning Progress</strong><br><br>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Java Fundamentals</span>
                    <span style="color: #10b981;">✓ Completed</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Spring Boot Mastery</span>
                    <span style="color: #6366f1;">85% Complete</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>React Advanced</span>
                    <span style="color: #f59e0b;">62% Complete</span>
                </div>
            </div>`,
        delay: 1000
    },
    'courses': {
        message: `📚 <strong>Your Enrolled Courses</strong><br><br>
            <ol style="margin: 0; padding-left: 20px;">
                <li>Spring Boot Microservices <span style="color: #10b981;">(Active)</span></li>
                <li>React + TypeScript <span style="color: #10b981;">(Active)</span></li>
                <li>System Design Fundamentals <span style="color: #6366f1;">(Upcoming)</span></li>
            </ol><br>
            Total enrolled: <strong>3 courses</strong>`,
        delay: 800
    },
    'transcript': {
        message: `📄 <strong>Transcript Ready</strong><br><br>
            Your academic transcript has been generated!<br><br>
            <div style="background: rgba(99, 102, 241, 0.1); padding: 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">📥</span>
                <div>
                    <strong>transcript_2024.pdf</strong><br>
                    <span style="font-size: 12px; color: #a0a0b0;">Click to download</span>
                </div>
            </div>`,
        delay: 1200
    },
    'recommend': {
        message: `🎯 <strong>Recommended For You</strong><br><br>
            Based on your learning history:<br><br>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="background: rgba(16, 185, 129, 0.1); padding: 10px; border-radius: 8px;">
                    <strong>Kubernetes Essentials</strong><br>
                    <span style="font-size: 12px; color: #10b981;">95% match • Peers are taking this</span>
                </div>
                <div style="background: rgba(99, 102, 241, 0.1); padding: 10px; border-radius: 8px;">
                    <strong>AWS Solutions Architect</strong><br>
                    <span style="font-size: 12px; color: #6366f1;">89% match • Trending now</span>
                </div>
            </div>`,
        delay: 1000
    },
    'default': {
        message: `I understand you're asking about "<strong>{{query}}</strong>".<br><br>
            I can help you with:<br>
            • 📊 Course progress tracking<br>
            • 📚 Enrolled courses info<br>
            • 📄 Transcript downloads<br>
            • 🎯 Course recommendations<br><br>
            Try clicking one of the suggestions below!`,
        delay: 600
    }
};

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${content}</p>`;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'message bot-message typing-indicator';
    indicatorDiv.id = 'typingIndicator';
    indicatorDiv.innerHTML = `
        <div class="message-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
        </div>
        <div class="message-content">
            <p style="display: flex; gap: 4px;">
                <span class="typing-dot" style="animation: typingDot 1s infinite;">●</span>
                <span class="typing-dot" style="animation: typingDot 1s infinite 0.2s;">●</span>
                <span class="typing-dot" style="animation: typingDot 1s infinite 0.4s;">●</span>
            </p>
        </div>
    `;
    chatMessages.appendChild(indicatorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add typing animation styles if not present
    if (!document.getElementById('typingStyles')) {
        const style = document.createElement('style');
        style.id = 'typingStyles';
        style.textContent = `
            @keyframes typingDot {
                0%, 60%, 100% { opacity: 0.3; }
                30% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function getResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('progress') || lowerQuery.includes('status')) {
        return chatResponses.progress;
    } else if (lowerQuery.includes('course') || lowerQuery.includes('enroll')) {
        return chatResponses.courses;
    } else if (lowerQuery.includes('transcript') || lowerQuery.includes('download')) {
        return chatResponses.transcript;
    } else if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
        return chatResponses.recommend;
    } else {
        return {
            message: chatResponses.default.message.replace('{{query}}', query),
            delay: chatResponses.default.delay
        };
    }
}

function handleChat(query) {
    if (!query.trim()) return;
    
    // Add user message
    addMessage(query, true);
    chatInput.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    // Get and show response
    const response = getResponse(query);
    setTimeout(() => {
        removeTypingIndicator();
        addMessage(response.message);
    }, response.delay);
}

// Chat input handlers
sendBtn.addEventListener('click', () => handleChat(chatInput.value));
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat(chatInput.value);
});

// Suggestion buttons
chatSuggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
        handleChat(e.target.dataset.query);
    }
});

// ===== Recommendation Tabs =====
const recTabs = document.querySelectorAll('.rec-tab');
const recPanels = document.querySelectorAll('.rec-panel');

recTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const strategy = tab.dataset.strategy;
        
        // Update tabs
        recTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update panels
        recPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `rec-${strategy}`) {
                panel.classList.add('active');
            }
        });
    });
});

// ===== Animated Counters =====
function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(target % 1 !== 0 ? 2 : 0);
    }, stepDuration);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

// Timeline items observer
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Skill cards progress animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.querySelector('.skill-progress');
            if (progress) {
                progress.style.width = progress.style.getPropertyValue('--progress');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach(card => {
    skillObserver.observe(card);
});

// Impact numbers animation
const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberEl = entry.target.querySelector('.impact-number[data-count]');
            if (numberEl && !numberEl.classList.contains('animated')) {
                numberEl.classList.add('animated');
                animateCounter(numberEl, parseInt(numberEl.dataset.count));
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.impact-stat').forEach(stat => {
    impactObserver.observe(stat);
});

// CGPA counter animation
const cgpaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cgpaEl = entry.target.querySelector('.cgpa-value[data-count]');
            if (cgpaEl && !cgpaEl.classList.contains('animated')) {
                cgpaEl.classList.add('animated');
                animateCounter(cgpaEl, parseFloat(cgpaEl.dataset.count));
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.education-highlight').forEach(edu => {
    cgpaObserver.observe(edu);
});

// ===== Copy to Clipboard =====
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const textToCopy = btn.dataset.copy;
        try {
            await navigator.clipboard.writeText(textToCopy);
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy');
        }
    });
});

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations
    updateActiveNavLink();
    
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
});

// ===== Parallax Effect for Orbs =====
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('.gradient-orb').forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
});
