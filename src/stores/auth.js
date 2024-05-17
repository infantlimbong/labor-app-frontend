import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore({
    id: "auth",

    state: () => ({
        accessToken: null,
        userData: null,
    }),

    getters: {
        isLoggedIn() {
            return this.accessToken !== null;
        },
        getUserData() {
            return this.userData;
        },
    },

    actions: {
        setAccessToken(token) {
            this.accessToken = token;
            this.fetchUser();
        },

        setUser(user) {
            this.user = user;
        },

        removeAccessToken() {
            this.accessToken = null;
            this.userData = null;
        },

        async fetchUser() {
            try {
                const response = await axios.get("http://localhost:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                });
      
                this.setUser(response.data);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
        },

        logout() {
            try {
                axios.post("http://localhost:8000/api/logout", {}, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                }).then(() => {
                    this.removeAccessToken();
                    console.log("Logout successful");
                }).catch((error) => {
                    console.error("An error occurred during logout:", error.message);
                });
            } catch (error) {
                console.error("An error occurred during logout:", error.message);
            }
        },        
    },
});
