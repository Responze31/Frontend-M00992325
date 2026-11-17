new Vue({
    el: '#app',
    data: {
        sitename: 'Club Activities',
        serverUrl: 'https://backend-m00992325.onrender.com',
        cart: [],
        showCart: false,
        name: '',
        phone: '',
        message: '',
        sortBy: 'subject',
        order: 'ascend',
        searchQuery: '',
        teachers: [],
        selectedTeacher: '',
        lessons: []
    },
    created() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (e) {
                this.cart = [];
            }
        }
        this.fetchLessons();
        this.fetchTeachers();
    },
    computed: {
        sortedLessons() {
            const dir = this.order === 'ascend' ? 1 : -1;
            return this.lessons.slice().sort((a, b) => {
                const x = a[this.sortBy], y = b[this.sortBy];
                if (x < y) return -1 * dir;
                if (x > y) return 1 * dir;
                return 0;
            });
        },
        cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
        totalPrice() {
            return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        }
    },
    methods: {
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        applyCartSpaces(lessons) {
            let updated = false;
            const adjusted = lessons.map(lesson => {
                const item = this.cart.find(i => i.lessonId === lesson._id);
                if (item) {
                    lesson.spaces = Math.max(0, lesson.spaces - item.quantity);
                    item.remainingSpaces = lesson.spaces;
                    updated = true;
                }
                return lesson;
            });
            if (updated) {
                this.saveCart();
            }
            return adjusted;
        },
        fetchLessons() {
            const url = this.selectedTeacher
                ? `${this.serverUrl}/lessons?teacher=${encodeURIComponent(this.selectedTeacher)}`
                : `${this.serverUrl}/lessons`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.lessons = this.applyCartSpaces(data);
                })
                .catch(err => console.error('Error fetching lessons:', err));
        },
        fetchTeachers() {
            fetch(`${this.serverUrl}/teachers`)
                .then(response => response.json())
                .then(data => {
                    this.teachers = data;
                })
                .catch(err => console.error('Error fetching teachers:', err));
        },
        searchLessons() {
            this.selectedTeacher = '';
            const query = this.searchQuery;
            fetch(`${this.serverUrl}/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (query === this.searchQuery) {
                        this.lessons = this.applyCartSpaces(data);
                    }
                })
                .catch(err => console.error('Error searching lessons:', err));
        },
        filterByTeacher() {
            this.searchQuery = '';
            this.fetchLessons();
        },
        add(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces--;
                this.message = '';
                const item = this.cart.find(i => i.lessonId === lesson._id);
                if (item) {
                    item.quantity++;
                    item.remainingSpaces = lesson.spaces;
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
            }
        },
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
            if (!this.cart.length) {
                this.showCart = false;
            }
        },
        validName() {
            return /^[A-Za-z\s]+$/.test(this.name.trim());
        },
        validPhone() {
            return /^[0-9]+$/.test(this.phone.trim());
        },
        valid() {
            return this.validName() && this.validPhone();
        },
        checkout() {
            const orderData = {
                name: this.name.trim(),
                phone: this.phone.trim(),
                lessons: this.cart.map(item => ({
                    lessonId: item.lessonId,
                    spaces: item.quantity
                }))
            };

            fetch(`${this.serverUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Order request failed');
                }
                return response.json();
            })
            .then(() => {
                const updates = this.cart.map(item =>
                    fetch(`${this.serverUrl}/lessons/${item.lessonId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ spaces: item.remainingSpaces })
                    }).then(res => {
                        if (!res.ok) {
                            throw new Error('Failed to update spaces');
                        }
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
            .catch(err => console.error('Error submitting order:', err));
        }
    }
});
