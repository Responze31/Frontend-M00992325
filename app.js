new Vue({
    el: '#app',
    data: {
        sitename: 'After School Lessons',
        cart: [],
        showCart: false,
        name: '',
        phone: '',
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
    methods: {
        add(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces--;
                this.cart.push(lesson);
            }
        },
        remove(lesson) {
            lesson.spaces++;
            this.cart.splice(this.cart.indexOf(lesson), 1);
        },
        sortLessons() {
            this.lessons.sort((a, b) => {
                if (this.order === 'ascend') {
                    return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
                }
                return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
            });
        },
        valid() {
            return /^[A-Za-z\s]+$/.test(this.name) && /^[0-9]+$/.test(this.phone);
        },
        checkout() {
            alert('Order submitted!');
        }
    }
});

