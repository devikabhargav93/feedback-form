const FormManager = {
    form: null,
    submitBtn: null,
    successMessage: null,
    ratingButtons: null,
    ratingInput: null,
    productTypeSelect: null,
    productSelect: null,

    productData: {
        Soaps: [
            { value: 'PureNest Soap Rose', label: 'PureNest Soap Rose' },
            { value: 'PureNest Soap Tranquil', label: 'PureNest Soap Tranquil' }
        ],
        Salts: [
            { value: 'Serenova Salts Rose', label: 'Serenova Salts Rose' },
            { value: 'Serenova Salts Tranquil', label: 'Serenova Salts Tranquil' }
        ]
    },

    init() {
        this.cacheElements();
        this.attachEventListeners();
    },

    cacheElements() {
        this.form = document.getElementById('feedbackForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.successRatingContainer = document.getElementById('successRating');
        this.ratingButtons = document.querySelectorAll('.rating-btn');
        this.ratingInput = document.getElementById('rating');
        this.productTypeSelect = document.getElementById('productType');
        this.productSelect = document.getElementById('product');
    },

    attachEventListeners() {
        this.attachRatingListeners();
        this.attachFormSubmitListener();
        this.attachFieldChangeListeners();
        this.attachProductTypeListener();
    },

    attachProductTypeListener() {
        this.productTypeSelect.addEventListener('change', (e) => {
            this.handleProductTypeChange(e.target.value);
        });
    },

    handleProductTypeChange(productType) {
        this.productSelect.innerHTML = '<option value="">Select a product</option>';
        
        if (!productType) {
            this.productSelect.disabled = true;
            return;
        }

        this.productSelect.disabled = false;
        const products = this.productData[productType] || [];
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.value;
            option.textContent = product.label;
            this.productSelect.appendChild(option);
        });
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

        // Check for local file protocol or common static servers like Live Server
        if (window.location.protocol === 'file:' || window.location.port === '5500') {
            alert('Serverless functions require a Netlify environment to run. Please use "npm run dev" (Netlify CLI) instead of Live Server.');
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
                let errorMessage = 'Failed to submit review';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.details || errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Server error (${response.status}): ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            // Optional: try to parse success response but don't fail if empty
            try { await response.json(); } catch (e) { /* ignore empty success body */ }

            this.displaySuccessMessage();
            // Removed automatic reset to prevent perceived redirect
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
        
        // Render stars based on rating
        const rating = parseInt(this.ratingInput.value) || 0;
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const delay = i * 0.1;
            if (i <= rating) {
                starsHtml += `<span class="success-star" style="animation-delay: ${delay}s">★</span>`;
            } else {
                starsHtml += `<span class="success-star empty" style="animation-delay: ${delay}s">★</span>`;
            }
        }
        this.successRatingContainer.innerHTML = starsHtml;
        
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
