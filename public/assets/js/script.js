const FormManager = {
    form: null,
    submitBtn: null,
    successMessage: null,
    ratingButtons: null,
    ratingInput: null,

    init() {
        this.cacheElements();
        this.attachEventListeners();
    },

    cacheElements() {
        this.form = document.getElementById('feedbackForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.ratingButtons = document.querySelectorAll('.rating-btn');
        this.ratingInput = document.getElementById('rating');
    },

    attachEventListeners() {
        this.attachRatingListeners();
        this.attachFormSubmitListener();
        this.attachFieldChangeListeners();
    },

    attachRatingListeners() {
        this.ratingButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRatingClick(e));
        });
    },

    handleRatingClick(e) {
        e.preventDefault();
        this.ratingButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.ratingInput.value = e.target.dataset.rating;
    },

    attachFormSubmitListener() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    },

    async handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        // Check for local file protocol
        if (window.location.protocol === 'file:') {
            alert('Serverless functions cannot be tested via file:// protocol. Please run this using a local server (e.g., "netlify dev").');
            return;
        }

        const formData = this.collectFormData();
        
        // Show loading state
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Submitting...';

        try {
            const response = await fetch('/.netlify/functions/submit-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to submit review');
            }

            this.displaySuccessMessage();
            this.resetFormAfterDelay();
        } catch (error) {
            console.error('Submission error:', error);
            alert(`Error: ${error.message}`);
            
            // Reset button state
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Submit Your Review';
        }
    },

    validateForm() {
        let isValid = true;
        const fields = ['name', 'email', 'product', 'review'];

        fields.forEach(field => {
            const input = document.getElementById(field);
            const group = input.closest('.form-group');

            if (!input.value.trim()) {
                group.classList.add('error');
                isValid = false;
            } else {
                group.classList.remove('error');
            }
        });

        if (!this.validateEmail()) {
            isValid = false;
        }

        return isValid;
    },

    validateEmail() {
        const emailInput = document.getElementById('email');
        const emailValue = emailInput.value;

        if (!emailValue) {
            return true;
        }

        const isValidEmail = this.isValidEmail(emailValue);

        if (!isValidEmail) {
            emailInput.closest('.form-group').classList.add('error');
        }

        return isValidEmail;
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    collectFormData() {
        return {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            product: document.getElementById('product').value,
            rating: this.ratingInput.value || 'Not rated',
            review: document.getElementById('review').value,
            subscribe: document.getElementById('subscribe').checked,
            timestamp: new Date().toLocaleString()
        };
    },

    displaySuccessMessage() {
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
    },

    resetFormAfterDelay() {
        setTimeout(() => {
            this.form.reset();
            this.form.style.display = 'block';
            this.successMessage.style.display = 'none';
            this.ratingButtons.forEach(btn => btn.classList.remove('active'));
            this.ratingInput.value = '';
            
            // Reset button state
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Submit Your Review';
        }, 3000);
    },

    attachFieldChangeListeners() {
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('change', () => {
                field.closest('.form-group')?.classList.remove('error');
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FormManager.init();
});
