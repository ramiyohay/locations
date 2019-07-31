export class StorageService {
    saveLocations(data) {
        localStorage.setItem('locations', JSON.stringify(data));
    }

    getLocations() {
        try {
            const data = localStorage.getItem('locations');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveCategories(data) {
        localStorage.setItem('categories', JSON.stringify(data));
    }

    getCategories() {
        try {
            const data = localStorage.getItem('categories');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
}

const storageService = new StorageService();

export default storageService;
