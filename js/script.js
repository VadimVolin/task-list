var app = new Vue({
	el: '.app',
	data: {
		title: 'TaskList',
		main_btn: 'Add',
		show: false,
		message: '',
		index: 0,
		inputTask: '',
		items: [],
		doChange: false,
		changeIndex: 0,
		changeText: '',
		data: [1],
		currentPage: 1,
		perPage : 10,
		pagination: {}
	},
	mounted() {
		if (localStorage.getItem('items')) {
			try {
				this.items = JSON.parse(localStorage.getItem('items'));
			} catch(e) {
				localStorage.removeItem('items');
			}
		}
		if (localStorage.getItem('data')) {
			try {
				this.data = JSON.parse(localStorage.getItem('data'));
			} catch(e) {
				localStorage.removeItem('data');
			}
		}
		this.setPage(1);
	},
	computed: {
		collection() {
			return this.paginate(this.items);
		}
	},
	methods: {
		addItem: function () {
			if (this.doChange) {
				if (this.inputTask != '') {
					if (this.inputTask.length > 0 && this.inputTask.length < 100) {
						this.items.splice(this.changeIndex, 1, this.inputTask);
						this.inputTask = '';
						this.show = true;
						this.message = 'Task changed!';
						this.doChange = false;
						this.saveItems();
						this.main_btn = "Add";
						setTimeout(() => this.show=false, 2500);
					} else {
						this.message = 'Please, message length can not be greater then 150!';
						this.show = true;
						this.saveItems();
						setTimeout(() => this.show=false, 2500);
					}
				} else {
					this.show = true;
					this.message = 'Please, write task!';
					this.saveItems();
					setTimeout(() => this.show=false, 2500);
				}
			} else {
				if (this.inputTask != '') {
					if (this.inputTask.length > 0 && this.inputTask.length < 100) {
						this.index++;
						this.items.push(this.inputTask);
						this.inputTask = '';
						this.show = true;
						this.message = 'Task added!';
						this.saveItems();
						setTimeout(() => this.show=false, 2500);
					} else {
						this.message = 'Please, message length can not be greater then 150!';
						this.show = true;
						this.saveItems();
						setTimeout(() => this.show=false, 2500);
					}
				} else {
					this.show = true;
					this.message = 'Please, write task!';
					this.saveItems();
					setTimeout(() => this.show=false, 2500);
				}
			}
			this.setPage(1);
		},
		changeItem(x) {
			this.doChange = true;
			this.main_btn = "Save";
			this.changeIndex = this.items.indexOf(x);
			this.inputTask = x;
		},
		saveItems () {
			this.setPage(this.data[this.data.length - 1]);
			const parsedItems = JSON.stringify(this.items);
			localStorage.setItem('items', parsedItems);
		},
		deleteItem: function (x) {
			var deletIndex = this.items.indexOf(x);
			this.items.splice(deletIndex, 1);
			this.saveItems();
			this.setPage(1);
		},
		setPage: function (p) {
			this.pagination = this.paginator(this.items.length, p);
		},
		paginate (data) {
			return _.slice(data, this.pagination.startIndex, this.pagination.endIndex + 1);
		},
		paginator (totalItems, currentItems) {
			var startIndex = (currentItems - 1) * this.perPage,
			endIndex = Math.min(startIndex + this.perPage - 1, totalItems - 1);
			return {
				currentItems: currentItems,
				startIndex: (startIndex > 0) ? startIndex : 0,
				endIndex: (endIndex > 0) ? endIndex : 0,
				pages: _.range(1, Math.ceil(totalItems / this.perPage) + 1)
			};
		}
	},
	created () {
		this.setPage(1);
	}
});