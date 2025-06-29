import { axiosClient } from "@/utils/axiosClient";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';


  type headers = {
    contentType?: 'json' | 'image' | 'text' | 'video'; // Add more types if needed
    'X-CSRF-Token'?: string;
    'Authorization'?: string | undefined;
  };

  
  type message = {
    error?: any;
    success?: any;
   
  };
  
  type responstype = {
    result?: result;
    message?: message;
    error ? : any
    apiVersion?: string;
    hash?: any;
    email?: string;
    email_verified?: boolean;
    family_name ?: string
    given_name ? : string
    name?: string
    picture ? :string
    sub ? : string 
    stats ? : any;
    activities ? : any;
   
  };

  type result = {
    users?: any;
    data?: any[];
    result: any;
    history: any
    csrf_token ? : string;
    _id : string;
    stats : any
  }


  export interface TypeApiPromise {
    status?: number;
    response?: responstype;
  }


  export interface API_CALL_PROPS {
    method?: Method;
    url?: string;
    baseURL?: string;
    body?: any;
    apiVersion?: '1.0';
    headers?: headers;
    params?: Object
  }
  


  
export const API_CALL = async (props: API_CALL_PROPS): Promise<TypeApiPromise> => {
     
    let baseUrl = props.baseURL;
    
    if (typeof window !== 'undefined') {
        // Only access window.location when in browser environment
        baseUrl = baseUrl || `${window.location.origin}/api`;
    } else {
        // Fallback for server-side rendering
        baseUrl = baseUrl || '/api';
    }
    
    const api = axios.create({ baseURL: baseUrl }) 
  
    // Define default headers for different content types
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };
  
    const config: AxiosRequestConfig = {
      ...props,
      data: props.body || undefined,
      headers: {
        ...defaultHeaders,
        ...props?.headers,
      },
    };
  
    try {
      // If contentType is 'image', use FormData for image upload
      if (props.headers?.contentType === 'image') {
        const formData = new FormData();
        formData.append('image', props.body);
        config.data = formData;
  
      }
  
      const response: AxiosResponse = await api(config);
  
      return {
        status: response.status,
        response: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            status: error.response.status,
            response: error.response.data,
          };
        } else if (error.request) {
          return {
            status: 500,
            response: { message: { error: 'Network error occurred' } },
          };
        } else {
          return {
            status: 500,
            response: { message: { error: 'An error occurred' } },
          };
        }
      } else {
        return {
          status: 500,
          response: { message: { error: 'An error occurred' } },
        };
      }
    }
  };
  