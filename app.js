new Vue({
    el: '#app',
    data: {
        sitename: 'After School Lessons',
        cart: [],
        showCart: false,
        name: '',
        phone: '',
        message: '',
        sortBy: 'subject',
        order: 'ascend',
        lessons: [
            { id: 1, subject: 'Math', location: 'Hendon', price: 100, spaces: 5, icon: 'fa-solid fa-calculator', image: 'images/maths.png' },
            { id: 2, subject: 'English', location: 'Colindale', price: 90, spaces: 5, icon: 'fa-solid fa-book', image: 'images/english.png' },
            { id: 3, subject: 'Science', location: 'Brent Cross', price: 110, spaces: 5, icon: 'fa-solid fa-flask', image: 'images/science.png' },
            { id: 4, subject: 'History', location: 'Golders Green', price: 85, spaces: 5, icon: 'fa-solid fa-landmark', image: 'images/history.png' },
            { id: 5, subject: 'Geography', location: 'Hendon', price: 85, spaces: 5, icon: 'fa-solid fa-globe', image: 'images/geography.png' },
            { id: 6, subject: 'Coding', location: 'Camden', price: 120, spaces: 5, icon: 'fa-solid fa-code', image: 'images/coding.png' },
            { id: 7, subject: 'Robotics', location: 'Colindale', price: 130, spaces: 5, icon: 'fa-solid fa-robot', image: 'images/robotics.png' },
            { id: 8, subject: 'Art', location: 'Finchley', price: 95, spaces: 5, icon: 'fa-solid fa-palette', image: 'images/art.png' },
            { id: 9, subject: 'Music', location: 'Hendon', price: 115, spaces: 5, icon: 'fa-solid fa-music', image: 'images/music.png' },
            { id: 10, subject: 'Drama', location: 'Camden', price: 90, spaces: 5, icon: 'fa-solid fa-masks-theater', image: 'images/drama.png' }
        ]
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
        }
    },
    methods: {
        getLesson(id) {
            return this.lessons.find(l => l.id === id);
        },
        add(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces--;
                this.message = '';
                const item = this.cart.find(i => i.lessonId === lesson.id);
                if (item) {
                    item.quantity++;
                } else {
                    this.cart.push({ lessonId: lesson.id, quantity: 1 });
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
            if (this.cart.length === 0) {
                this.showCart = false;
            }
        },
        valid() {
            return /^[A-Za-z\s]+$/.test(this.name) && /^[0-9]+$/.test(this.phone);
        },
        checkout() {
            this.message = 'Order submitted!';
            this.cart = [];
            this.name = '';
            this.phone = '';
            this.showCart = false;
        }
    }
});

