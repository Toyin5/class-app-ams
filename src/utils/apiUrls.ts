const apiUrls = {
  user: {
    register: "/user/register",
    login: "/user/login",
    logout: "/user/logout",
    verify: "/user/verify",
    onboard: "/user/onboard",
    getAll: "/users",
    getOne: (id: string) => `/user/${id}`,
  },
  course: {
    create: "/course/create",
  },
} as const;

export default apiUrls;
