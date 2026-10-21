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
            { id: 1, subject: 'Math', location: 'Hendon', price: 100, spaces: 5, icon: 'fa-solid fa-calculator', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
            { id: 2, subject: 'English', location: 'Colindale', price: 90, spaces: 5, icon: 'fa-solid fa-book', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400' },
            { id: 3, subject: 'Science', location: 'Brent Cross', price: 110, spaces: 5, icon: 'fa-solid fa-flask', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400' },
            { id: 4, subject: 'History', location: 'Golders Green', price: 85, spaces: 5, icon: 'fa-solid fa-landmark', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400' },
            { id: 5, subject: 'Geography', location: 'Hendon', price: 85, spaces: 5, icon: 'fa-solid fa-globe', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400' },
            { id: 6, subject: 'Coding', location: 'Camden', price: 120, spaces: 5, icon: 'fa-solid fa-code', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400' },
            { id: 7, subject: 'Robotics', location: 'Colindale', price: 130, spaces: 5, icon: 'fa-solid fa-robot', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400' },
            { id: 8, subject: 'Art', location: 'Finchley', price: 95, spaces: 5, icon: 'fa-solid fa-palette', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400' },
            { id: 9, subject: 'Music', location: 'Hendon', price: 115, spaces: 5, icon: 'fa-solid fa-music', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400' },
            { id: 10, subject: 'Drama', location: 'Camden', price: 90, spaces: 5, icon: 'fa-solid fa-masks-theater', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400' }
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

