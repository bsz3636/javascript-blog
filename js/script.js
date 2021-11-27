{
  ('use strict');

  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.sidebar .tags',
    cloudClassCount: 6,
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.sidebar .authors'
  };

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    /*console.log('Link was clicked!');
    console.log(event);*/
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* add class 'active' to the clicked link */
    /*console.log('clickedElement:', clickedElement);*/
    clickedElement.classList.add('active');
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    /*console.log('articleSelector:', articleSelector);*/
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    /*console.log('targetArticle:', targetArticle);*/
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };


  const generateTitleLinks = function (customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(opts.titleListSelector);
    /*console.log('titleList: ', titleList);
    console.log('customSelector: ', customSelector);*/
    /*function clearMessages() {*/
    titleList.innerHTML = '';
    /*}
    clearMessages();*/
    /* for each article */
    const articles = document.querySelectorAll(opts.articleSelector + customSelector);
    /*console.log('articles: ', articles);*/
    let html = '';
    for (let article of articles) {
      /*console.log(article);*/
      /* get the article id */
      const articleId = article.getAttribute('id');
      /*console.log('articleId:', articleId);*/
      /* find the title element */
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
      /*console.log('articleTitle: ', articleTitle);*/
      /* create HTML of the link */
      let linkHTML = '<li><a href="#' + articleId + ' "><span>' + articleTitle + '</span></a></li>';
      /*console.log('linkHTML: ', linkHTML);*/
      /* insert link into titleList */
      html = html + linkHTML;
      /*console.log('html= ', html);*/
    }
    titleList.innerHTML = html;
  };

  generateTitleLinks();

  const links = document.querySelectorAll('.titles a');
  /*console.log('links: ', links);*/

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }

  const calculateTagsParams = function (tags) {
    const params = {max: 0, min: 999999};
    for(let tag in tags){
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
      //console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
  };

  const calculateTagClass = function (count, params) {
    //console.log('count, params: ',count, params);
    const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * (opts.cloudClassCount-1) + 1 );
    //console.log('tag_size: ',classNumber);
    return opts.cloudClassPrefix + classNumber;
  };

  const generateTags = function () {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);
    /*console.log('articles: ', articles);*/
    /* START LOOP: for every article: */
    for (let article of articles) {
      /*console.log(article);*/
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opts.articleTagsSelector);
      /*console.log('tagsWrapper: ', tagsWrapper);*/
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const tags = article.getAttribute('data-tags');
      /*console.log('tags: ', tags);*/
      /* split tags into array */
      const tagsArray = tags.split(' ');
      /*console.log('tagsArray: ', tagsArray);*/
      /* START LOOP: for each tag */
      for (let tag of tagsArray) {
        /*console.log('tag: ', tag);*/
        /* generate HTML of the link */
        let linkHTML =
          '<li><a href="#tag-' + tag + '"><span>' + tag + ' '+ '</span></a></li>';
        //console.log('linkHTML: ', linkHTML);
        /* add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opts.tagsListSelector);
    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    //console.log('tagsParams: ', tagsParams);
    let allTagsHTML = '';
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
      const tagLinkHTML = '<li><a href ="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"><span> ' + tag  + '</span></a></li>';
      console.log('tagLinkHTML:', tagLinkHTML);
      allTagsHTML += tagLinkHTML;
      /*'<li><a href="#tag-' + tag + ' (' + allTags[tag] + ') "><span>' + tag + ' (' + allTags[tag] + ')  '+ '</span></a></li>';*/
    /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  };
  generateTags();

  const tagClickHandler = function (event) {
    /*console.log('Link was clicked!');
    console.log(event);*/
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /*console.log('href :', href);*/
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-' ,'');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /*console.log(activeTagLinks);*/
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const targetTags = document.querySelectorAll('a[href="' + href + '"]');
    /*console.log('targetTags: ', targetTags);*/
    /* START LOOP: for each found tag link */
    for (let targetTag of targetTags) {
      /* add class active */
      targetTag.classList.add('active');
      /*console.log('targetTag: ', targetTags);*/
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function () {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    /*console.log('tagLinks: ',tagLinks);*/
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  };
  addClickListenersToTags();

  const calculateAuthorsParams = function (authors) {
    const params = {max: 0, min: 999999};
    for(let author in authors){
      params.max = Math.max(authors[author], params.max);
      params.min = Math.min(authors[author], params.min);
      console.log(author + ' is used ' + authors[author] + ' times');
    }
    return params;
  };

  const generateAuthors = function () {
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);
    /*console.log('articles: ', articles);*/
    /* START LOOP: for every article: */
    for (let article of articles) {
      /*console.log('article: ',article);*/
      /* find author wrapper */
      const authorWrapper = article.querySelector(opts.articleAuthorSelector);
      //console.log(authorWrapper);
      /* make html variable with empty string */
      let html = '';
      /* get author from data-author attribute */
      const author = article.getAttribute('data-author');
      //console.log('author: ', author);
      /* generate HTML of the link */
      let linkHTML = '<a href="#author-' + author + '"><span>' + author + '</span></a>';
      //console.log('linkHTML: ',linkHTML);
      /* add generated code to html variable */
      html = html + linkHTML;
      if(!allAuthors[author]) {
        /* [NEW] add tag to allTags object */
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
      /* insert HTML of all the links into the authors wrapper */
      authorWrapper.innerHTML = html;
      //console.log( 'authorWrapper: ', authorWrapper);
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const authorList = document.querySelector(opts.authorsListSelector);
    /* [NEW] create variable for all links HTML code */
    const authorsParams = calculateAuthorsParams(allAuthors);
    console.log('authorsParams: ', authorsParams);
    /* [NEW] add html from allTags to tagList */
    //authorList.innerHTML = allAuthors.join(' ');
    let allAuthorsHTML = '';
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let author in allAuthors){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParam) + '</li>';
      const authorLinkHTML = '<li><a href ="#author-' + author + '"><span> ' + author +  ' (' + allAuthors[author] +  ')' + '</span></a></li>';
      console.log('authorLinkHTML:', authorLinkHTML);
      allAuthorsHTML += authorLinkHTML;
    }
    authorList.innerHTML = allAuthorsHTML;
  };

  generateAuthors();

  const authorClickHandler = function (event) {
    //console.log('authorClickHandler: ',authorClickHandler);
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');
    //console.log('author: ',author);
    /* find all authors links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    //console.log('activeAuthorLinks: ',activeAuthorLinks);
    /* START LOOP: for each active authors link */
    for (let activeAuthorLink of activeAuthorLinks) {
      /* remove class active */
      activeAuthorLink.classList.remove('active');
      /* END LOOP: for each active authors link */
    }
    /* find all authors links with "href" attribute equal to the "href" constant */
    const targetAuthors = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found authors link */
    for (let targetAuthor of targetAuthors) {
      /* add class active */
      targetAuthor.classList.add('active');
      /* END LOOP: for each found authors link */
    }
    /* execute function "generateAuthors" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function () {
    /* find all links to authors */
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    /* START LOOP: for each link */
    for (let authorLink of authorLinks) {
      /* add tagClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToAuthors();

}

