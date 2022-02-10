import {
  ARTICLE_LIST_REQUEST,
  ARTICLE_LIST_SUCCESS,
  ARTICLE_LIST_FAIL,
  ARTICLE_DISPLAY_REQUEST,
  ARTICLE_DISPLAY_SUCCESS,
  ARTICLE_DISPLAY_FAIL,
  ARTICLE_DELETE_REQUEST,
  ARTICLE_DELETE_SUCCESS,
  ARTICLE_DELETE_FAIL,
  ARTICLE_CREATE_REQUEST,
  ARTICLE_CREATE_SUCCESS,
  ARTICLE_CREATE_FAIL,
  ARTICLE_CREATE_RESET,
  ARTICLE_UPDATE_REQUEST,
  ARTICLE_UPDATE_SUCCESS,
  ARTICLE_UPDATE_FAIL,
  ARTICLE_UPDATE_RESET,
} from "../constants/articleConstants";

export const articleListReducer = (state = { articles: [] }, action) => {
  switch (action.type) {
    case ARTICLE_LIST_REQUEST:
      return { loadingArticles: true, articles: [] };
    case ARTICLE_LIST_SUCCESS:
      return {
        loadingArticles: false,
        articles: action.payload.articles,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case ARTICLE_LIST_FAIL:
      return { loadingArticles: false, error: action.payload };
    default:
      return state;
  }
};

export const displayArticleReducer = (state = { article: {} }, action) => {
  switch (action.type) {
    case ARTICLE_DISPLAY_REQUEST:
      return { loadingArticle: true, ...state };
    case ARTICLE_DISPLAY_SUCCESS:
      return { loadingArticle: false, article: action.payload };
    case ARTICLE_DISPLAY_FAIL:
      return { loadingArticle: false, error: action.payload };
    default:
      return state;
  }
};

export const articleDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ARTICLE_DELETE_REQUEST:
      return { loading: true };
    case ARTICLE_DELETE_SUCCESS:
      return { loadingArticle: false, success: true };
    case ARTICLE_DELETE_FAIL:
      return { loadingArticle: false, error: action.payload };
    default:
      return state;
  }
};

export const articleCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ARTICLE_CREATE_REQUEST:
      return { loading: true };
    case ARTICLE_CREATE_SUCCESS:
      return { loadingArticle: false, success: true, article: action.payload };
    case ARTICLE_CREATE_FAIL:
      return { loadingArticle: false, error: action.payload };
    case ARTICLE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const articleUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case ARTICLE_UPDATE_REQUEST:
      return { loading: true };
    case ARTICLE_UPDATE_SUCCESS:
      return { loading: false, success: true, article: action.payload };
    case ARTICLE_UPDATE_FAIL:
      return { loadingArticle: false, error: action.payload };
    case ARTICLE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
