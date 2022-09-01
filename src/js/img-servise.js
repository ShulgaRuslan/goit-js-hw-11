export default class ImgApiService{
    constructor(){
        // Какую страницу загружаем
        this.page = 1;
        //Подключем библиотеку для запросов
        this.axios = require('axios').default;
        
        this.query = "";
        
        this.status = "more";
        
        this.isnewquerty = true;
    }
    
    async fetchImages(searchQuery){
        let backupPage;
        if((searchQuery !== this.query)){ 
            backupPage = this.page;
            this.page = 1;
        };

        const KEY = '28160645-02600786ca706ffa5b60b520e';
        const url = 'https://pixabay.com/api/?';
        const per_page = 40;
        const options = {
            params: {
            'key': KEY,
            'image_type': 'photo',
            'orientation': 'horizontal',
            'safesearch': 'true',
            'q': searchQuery,
            'page': this.page,
            'per_page': per_page,
            },
        };
        try {
        const response = await this.axios.get(url, options);
        

      
        const totalHits = response.data.totalHits;
                if (totalHits === 0){
            this.page = backupPage;
        }else{
            this.isnewquerty = (searchQuery === this.query) ? false : true;
            this.query = searchQuery;
            const numberOfLetters = Math.ceil(totalHits / per_page);
           
            if(numberOfLetters === this.page){
                this.status = "end";
            }else{
                this.page += 1;
                this.status = "more";
            }
        }
 

        return response.data;
        } catch (error) {
            this.page = backupPage;
            console.log(error.message);
        }
    }
};