const vue = {
    data() {
        return {
            loading: false,
            editIndex: null,
            input: {
                'name': '',
                'email': ''
            },
            contacts: []
        }
    },
    methods: {
        submitHandler() {
            let { name, email } = this.input;
            if (!name || !email) return;
            this.loading = true;

            if (this.editIndex == null) {
                axios.post('http://localhost:8888/contact', this.input)
                    .then((res) => {
                        this.contacts.push(res.data);
                        this.clearHandler();
                        this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                    })
            }
            else {
                let id = this.contacts[this.editIndex].id;
                axios.put('http://localhost:8888/contact/' + id, this.input).then((res) => {
                    this.contacts[this.editIndex] = res.data;
                    this.clearHandler();
                    this.loading = false
                }).catch((err => {
                    console.log(err);
                }))
            }
        },
        clearHandler() {
            this.input.name = '';
            this.input.email = '';
            this.editIndex = null;
        },
        updateHandler(index) {
            let { name, email } = this.contacts[index];
            this.input.name = name;
            this.input.email = email;
            this.editIndex = index;
        },
        deleteHandler(index) {
            let target = this.contacts[index];

            if (confirm('是否刪除 ' + target.name + ' ?')) {
                this.loading = true;
                axios.delete('http://localhost:8888/contact/' + target.id)
                    .then((res) => {
                        this.contacts.splice(index, 1);
                        this.clearHandler();
                        this.loading = false;
                    }).then((err) => {
                        console.log(err);
                    })
            }
        }
    },
    mounted() {
        this.loading = true;
        axios.get('http://localhost:8888/contact')
            .then((res) => {
                console.log(res);
                this.contacts = res.data;
                this.loading = false;
            }).catch((err) => {
                console.log(err);
            })
    }
}

Vue.createApp(vue).mount('#app');