const BASE_URL = "https://api.github.com";

export interface ApiResponse extends Response {
    errors?: [{
      message: string;
    }]
}

export interface User {
    login: string;
    id: number;
}

export interface SearchUsersResponse {
  total_count: number;
  items: Array<User>;
}

const fetchHandler = 
   async (res : ApiResponse) => {
      const jsonRes = await res.json();
      if(!res.ok) {
        if(jsonRes.errors && Array.isArray(jsonRes.errors)){
          throw new Error(jsonRes.errors[0].message)
        }
        throw new Error(jsonRes.statusText || "Error: Something went wrong." )
      }
      return jsonRes 
    }

const fetchErrorHandler = (err: any) => { throw new Error('Error: Network Error')}

export const searchUsers = async (searchString: string) : Promise<SearchUsersResponse> => {
  return fetch(`${BASE_URL}/search/users?q=${searchString}+type:org`)
  .catch(fetchErrorHandler) 
  .then(fetchHandler)
};

interface SearchRepositoryOptions {
  repositoryName: string;
  organization: string
}

export interface Repository {
  name : string;
  open_issues_count: number;
  stargazers_count: number;
}

export interface SearchRepositoryResponse {
  total_count: number;
  items: Array<Repository>;
}

export const searchRepositories = async (options: SearchRepositoryOptions): Promise<SearchRepositoryResponse> => {
  const { organization, repositoryName } = options
  return fetch(`${BASE_URL}/search/repositories?q=${repositoryName}+org:${organization}`)
  .catch(fetchErrorHandler)
  .then(fetchHandler);
}
