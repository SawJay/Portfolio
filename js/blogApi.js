// you can test this locally by running your blog and using your localhost url,
// but the BASE_URL must NOT be a localhost url when you push your changes to netlify

const BASE_URL = 'https://sawyerscodeblog-production.up.railway.app'; // NOTE: with no / at the end!
const DEFAULT_BLOG_IMAGE = '/images/DefaultProfilePicture.png.png';
// e.g. '/images/DefaultBlogImage.jpg';

function fetchBlogData(){
    fetch(`${BASE_URL}/api/blogposts?page=1&pageSize=4`)
    .then(response => response.json())
    .then(pagedList => {
        displayBlogPosts(pagedList.data);
    });
}

function displayBlogPosts(blogPosts) {
    const template = document.getElementById('blog-card-template');
    const blogSection = document.getElementById('blogs');

    blogPosts.forEach(blogPost => {
        const blogPostCard = document.importNode(template.content, true);
        //format image
        let imageDiv = blogPostCard.querySelector('.blog-image-link');
        imageDiv.setAttribute(
            "href",
            `${BASE_URL}/posts/${blogPost.slug}`
        );
        imageDiv.href = `${BASE_URL}/posts/${blogPost.slug}`;

        let imgTag = document.createElement('img');
        imgTag.setAttribute(
            "src",
            BASE_URL + (blogPost.imageUrl || DEFAULT_BLOG_IMAGE)
        );
        imgTag.classList.add('blog-image');
        imageDiv.appendChild(imgTag);

        //add title
        let blogTitleDiv = blogPostCard.querySelector('.card-title');
        blogTitleDiv.innerHTML = blogPost.title;

        let blogDate = new Date(blogPost.created); // 2009-11-10
        let month = blogDate.toLocaleString('default', { month: 'long' });
        let day = blogDate.getDate();

        //add day
        let blogDayDiv = blogPostCard.querySelector('.blog-day');
        blogDayDiv.innerHTML = day;

        //add month
        let blogMonthDiv = blogPostCard.querySelector('.blog-month');

        blogMonthDiv.innerHTML = month;

        //add content
        let blogContentDiv = blogPostCard.querySelector('.card-body .card-text.line-clamp');
        blogContentDiv.innerHTML = blogPost.abstract;

        //readmore link
        let blogLink = blogPostCard.querySelector('.card-body .btn.btn-primary');
        blogLink.setAttribute(
            "href",
            `${BASE_URL}/posts/${blogPost.slug}`
        );

        let blogPubDate = blogPostCard.querySelector('small.text-muted');

        let dateToday = new Date();
        let createdDate = new Date(
            blogPost.updated != null ? blogPost.updated : blogPost.created
        );
        let diffTime = Math.abs(dateToday.getTime() - createdDate.getTime());
        let lastUpdated = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (lastUpdated == 1) {
            blogPubDate.innerHTML = `Published ${lastUpdated} day ago`;
        } else {
            blogPubDate.innerHTML = `Published ${lastUpdated} days ago`;
        }

        blogSection.appendChild(blogPostCard);
    });
}

fetchBlogData();