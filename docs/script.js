document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    /* ==========================================================================
       Intersection Observer for Scroll Animations
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-reveal').forEach(section => {
        observer.observe(section);
    });

    /* ==========================================================================
       Interactive Playground Logic
       ========================================================================== */
    const personas = {
        "1": {
            days: "14 Days",
            diag: "10",
            proc: "5",
            cat: "CIRCULATORY",
            riskClass: "risk-high",
            riskText: "High Readmission Risk",
            desc: "The combination of a long stay (>7 days) and multiple complex circulatory diagnoses strongly correlates with a 30-day readmission according to the Random Forest model."
        },
        "2": {
            days: "2 Days",
            diag: "1",
            proc: "0",
            cat: "EYE_DISEASES",
            riskClass: "risk-low",
            riskText: "Low Readmission Risk",
            desc: "A very short stay with a single localized diagnosis and no procedures indicates a highly routine encounter. The model predicts no readmission."
        },
        "3": {
            days: "8 Days",
            diag: "4",
            proc: "1",
            cat: "INFECTIOUS",
            riskClass: "risk-high",
            riskText: "Elevated Risk",
            desc: "Just crossing the 'Long Stay' threshold with an infectious disease triggers the model's elevated risk threshold, even with few procedures."
        }
    };

    const buttons = document.querySelectorAll('.persona-btn');
    const valDays = document.getElementById('val-days');
    const valDiag = document.getElementById('val-diag');
    const valProc = document.getElementById('val-proc');
    const valCat = document.getElementById('val-cat');
    
    const infStatus = document.getElementById('inference-status');
    const resText = document.getElementById('result-text');
    const resDesc = document.getElementById('result-desc');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const personaId = btn.getAttribute('data-persona');
            const data = personas[personaId];

            const resultsArea = document.querySelector('.playground-results');
            resultsArea.style.opacity = '0';
            
            setTimeout(() => {
                valDays.textContent = data.days;
                valDiag.textContent = data.diag;
                valProc.textContent = data.proc;
                valCat.textContent = data.cat;

                infStatus.className = `inference-result ${data.riskClass}`;
                resText.textContent = data.riskText;
                resDesc.textContent = data.desc;

                resultsArea.style.transition = 'opacity 0.3s ease';
                resultsArea.style.opacity = '1';
            }, 300);
        });
    });

    /* ==========================================================================
       Chart.js Initialization
       ========================================================================== */
    
    // Global Chart Defaults for our theme
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#5E6965'; // text-secondary
    
    // 1. Data Engineering Chart: Days Admitted Distribution
    const ctxDays = document.getElementById('daysAdmittedChart');
    if (ctxDays) {
        new Chart(ctxDays, {
            type: 'bar',
            data: {
                labels: ['1-3 Days', '4-7 Days', '8-14 Days', '15-21 Days', '22-30 Days', '30+ Days'],
                datasets: [{
                    label: 'Patient Encounters',
                    data: [45000, 32000, 15000, 5000, 2000, 1000],
                    backgroundColor: 'rgba(28, 35, 33, 0.8)', // text-primary
                    borderRadius: 4,
                    barPercentage: 0.8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Distribution of Hospital Stay Durations',
                        font: { size: 14, weight: '600', family: "'Playfair Display', serif" },
                        color: '#1C2321',
                        padding: { bottom: 20 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(227, 227, 224, 0.5)' },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                animation: { duration: 1500, easing: 'easeOutQuart' }
            }
        });
    }

    // 2. Results Chart: Model Performance Comparison
    const ctxRoc = document.getElementById('rocChart');
    if (ctxRoc) {
        new Chart(ctxRoc, {
            type: 'bar',
            data: {
                labels: ['XGBoost', 'Random Forest', 'LightGBM'],
                datasets: [
                    {
                        label: 'Accuracy',
                        data: [0.83, 0.85, 0.84],
                        backgroundColor: 'rgba(91, 140, 112, 0.85)', // Sage Green
                        borderRadius: 4
                    },
                    {
                        label: 'ROC AUC',
                        data: [0.65, 0.68, 0.66],
                        backgroundColor: 'rgba(217, 93, 57, 0.85)', // Terracotta
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: { usePointStyle: true, boxWidth: 8 }
                    },
                    title: {
                        display: true,
                        text: 'Model Performance Comparison',
                        font: { size: 14, weight: '600', family: "'Playfair Display', serif" },
                        color: '#1C2321',
                        padding: { bottom: 20 },
                        align: 'start'
                    }
                },
                scales: {
                    y: {
                        min: 0.5,
                        max: 1.0,
                        grid: { color: 'rgba(227, 227, 224, 0.5)' },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                animation: { duration: 1500, easing: 'easeOutQuart' }
            }
        });
    }

});
