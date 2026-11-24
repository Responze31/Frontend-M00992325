new Vue({
    el: '#app',
    data: {
        sitename: 'Club Activities',
        apiUrl: 'https://backend-m00992325.onrender.com',
        cart: [],
        showCart: false,
        name: '',
        phone: '',
        message: '',
        sortBy: 'subject',
        order: 'ascend',
        search: '',
        teachers: [],
        teacher: '',
        lessons: []
    },

    // load saved cart and fetch data when page opens
    created() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                this.cart = JSON.parse(saved);
            } catch (err) {
                this.cart = [];
            }
        }
        this.loadLessons();
        this.loadTeachers();
    },

    computed: {
        // sort lessons by chosen field and order
        sortedLessons() {
            const dir = this.order === 'ascend' ? 1 : -1;
            return this.lessons.slice().sort((a, b) => {
                if (a[this.sortBy] < b[this.sortBy]) return -1 * dir;
                if (a[this.sortBy] > b[this.sortBy]) return 1 * dir;
                return 0;
            });
        },

        // total number of items in cart
        totalItems() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },

        // total cost of everything in cart
        totalPrice() {
            return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
        }
    },

    methods: {
        // keep cart saved in browser
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        // take away spaces already in cart so numbers stay right
        syncSpaces(list) {
            list.forEach(lesson => {
                const found = this.cart.find(item => item.lessonId === lesson._id);
                if (found) {
                    lesson.spaces = Math.max(0, lesson.spaces - found.quantity);
                    found.remainingSpaces = lesson.spaces;
                }
            });
            this.saveCart();
            return list;
        },

        // get lessons from backend (or by teacher if one is picked)
        loadLessons() {
            let url = `${this.apiUrl}/lessons`;
            if (this.teacher) {
                url += `?teacher=${encodeURIComponent(this.teacher)}`;
            }
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    this.lessons = this.syncSpaces(data);
                })
                .catch(err => console.error('Could not load lessons:', err));
        },

        // get teacher list for dropdown
        loadTeachers() {
            fetch(`${this.apiUrl}/teachers`)
                .then(res => res.json())
                .then(data => {
                    this.teachers = data;
                })
                .catch(err => console.error('Could not load teachers:', err));
        },

        // search lessons on backend
        searchLessons() {
            this.teacher = '';
            const text = this.search;
            fetch(`${this.apiUrl}/search?q=${encodeURIComponent(text)}`)
                .then(res => res.json())
                .then(data => {
                    if (text === this.search) {
                        this.lessons = this.syncSpaces(data);
                    }
                })
                .catch(err => console.error('Search failed:', err));
        },

        // run when teacher dropdown changes
        pickTeacher() {
            this.search = '';
            this.loadLessons();
        },

        // add one space of a lesson to cart
        add(lesson) {
            if (lesson.spaces <= 0) return;

            lesson.spaces--;
            this.message = '';

            const found = this.cart.find(item => item.lessonId === lesson._id);
            if (found) {
                found.quantity++;
                found.remainingSpaces = lesson.spaces;
            } else {
                this.cart.push({
                    lessonId: lesson._id,
                    subject: lesson.subject,
                    location: lesson.location,
                    price: lesson.price,
                    image: lesson.image,
                    icon: lesson.icon,
                    quantity: 1,
                    remainingSpaces: lesson.spaces
                });
            }
            this.saveCart();
        },

        // remove one space from cart and add it back to lesson
        remove(item) {
            const lesson = this.lessons.find(l => l._id === item.lessonId);
            if (lesson) {
                lesson.spaces++;
            }

            item.quantity--;
            item.remainingSpaces++;

            if (item.quantity === 0) {
                this.cart.splice(this.cart.indexOf(item), 1);
            }
            this.saveCart();

            if (this.cart.length === 0) {
                this.showCart = false;
            }
        },

        // checkout form validation
        checkName() {
            return /^[A-Za-z\s]+$/.test(this.name.trim());
        },
        checkPhone() {
            return /^[0-9]+$/.test(this.phone.trim());
        },
        canCheckout() {
            return this.checkName() && this.checkPhone();
        },

        // send order to backend and update lesson spaces
        checkout() {
            const order = {
                name: this.name.trim(),
                phone: this.phone.trim(),
                lessons: this.cart.map(item => ({
                    lessonId: item.lessonId,
                    spaces: item.quantity
                }))
            };

            fetch(`${this.apiUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            })
            .then(res => {
                if (!res.ok) throw new Error('Order failed');
                return res.json();
            })
            .then(() => {
                const updates = this.cart.map(item =>
                    fetch(`${this.apiUrl}/lessons/${item.lessonId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ spaces: item.remainingSpaces })
                    }).then(res => {
                        if (!res.ok) throw new Error('Space update failed');
                    })
                );
                return Promise.all(updates);
            })
            .then(() => {
                this.message = 'Booking confirmed! Your spaces have been reserved.';
                this.cart = [];
                this.saveCart();
                this.name = '';
                this.phone = '';
                this.showCart = false;
                setTimeout(() => {
                    this.message = '';
                }, 4000);
            })
            .catch(err => console.error('Checkout error:', err));
        }
    }
});
