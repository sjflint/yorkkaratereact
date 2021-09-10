import {
  ARTICLE_LIST_REQUEST,
  ARTICLE_LIST_SUCCESS,
  ARTICLE_LIST_FAIL,
  ARTICLE_DISPLAY_REQUEST,
  ARTICLE_DISPLAY_SUCCESS,
  ARTICLE_DISPLAY_FAIL,
} from "../constants/articleConstants";

export const articleListReducer = (state = { articles: [] }, action) => {
  switch (action.type) {
    case ARTICLE_LIST_REQUEST:
      return { loadingArticles: true, articles: [] };
    case ARTICLE_LIST_SUCCESS:
      return { loadingArticles: false, articles: action.payload };
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
