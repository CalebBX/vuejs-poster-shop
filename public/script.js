const PRICE = 9.99;
const LOAD_NUM = 7;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        results: [],
        cart: [],
        search: 'dogs',
        lastSearch: '',
        loading: false
    },
    computed: {
        noMoreItems: function(){
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    methods: {
        appendItems: function(){
            if(this.items.length < this.results.length){
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function(){
            if(this.search.length){
                this.items = [];
                this.loading = true;
                this.$http.get('/search/' + this.search).then(function(res){
                    this.lastSearch = this.search;
                    this.results = res.data;
                    this.results.map(function(result){
                        result.price = PRICE;
                    });
                    this.appendItems();
                    this.loading = false;
                });
            }
        },
        addItem: function (index) {
            var item = this.items[index];
            this.total += item.price;
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },
        inc: function(item){
            item.qty ++;
            this.total += item.price;
        },
        dec: function(item){
            item.qty --;
            this.total -= item.price;
            if(item.qty <= 0){
                for(var i = 0; i < this.cart.length; i++){
                    if(this.cart[i].id === item.id){
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price){
            return '$' + price.toFixed(2);
        }
    },
    mounted: function(){
        this.onSubmit();

        var vueInstance = this
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function(){
            vueInstance.appendItems();
        });
    }
});


