new Vue({
    el: '#app',
    data: {
        sitename: 'After School Lessons',
        serverUrl: 'http://localhost:3000',
        cart: [],
        showCart: false,
        name: '',
        phone: '',
        message: '',
        sortBy: 'subject',
        order: 'ascend',
        lessons: [] // Fetched from Back-End
    },
    created() {
        this.fetchLessons();
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
            return this.cart.reduce((sum, item) => {
                const lesson = this.getLesson(item.lessonId);
                return sum + (lesson ? lesson.price * item.quantity : 0);
            }, 0);
        }
    },
    methods: {
        // A. Fetch that retrieves all lessons with GET (2%)
        fetchLessons() {
            fetch(`${this.serverUrl}/lessons`)
                .then(response => response.json())
                .then(data => {
                    this.lessons = data;
                })
                .catch(err => console.error('Error fetching lessons:', err));
        },
        getLesson(id) {
            return this.lessons.find(l => l._id === id);
        },
        add(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces--;
                this.message = '';
                const item = this.cart.find(i => i.lessonId === lesson._id);
                if (item) {
                    item.quantity++;
                } else {
                    this.cart.push({ lessonId: lesson._id, quantity: 1 });
                }
            }
        },
        remove(item) {
            const lesson = this.getLesson(item.lessonId);
            if (lesson) lesson.spaces++;
            item.quantity--;
            if (item.quantity === 0) {
                this.cart.splice(this.cart.indexOf(item), 1);
            }
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

            // B. Fetch that saves a new order with POST (2%)
            fetch(`${this.serverUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(() => {
                // C. Fetch that updates available lesson space with PUT (2%)
                this.cart.forEach(item => {
                    const lesson = this.getLesson(item.lessonId);
                    if (lesson) {
                        fetch(`${this.serverUrl}/lessons/${lesson._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ spaces: lesson.spaces })
                        });
                    }
                });

                this.message = 'Order submitted!';
                this.cart = [];
                this.name = '';
                this.phone = '';
                this.showCart = false;
            })
            .catch(err => console.error('Error submitting order:', err));
        }
    }
});