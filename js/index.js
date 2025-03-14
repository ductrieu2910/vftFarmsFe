// Get references to header elements
const headerTopPC = document.getElementById('header-top-pc');
const headerBottomPC = document.getElementById('header-bottom-pc');

// Store original header heights
const headerTopHeight = headerTopPC.offsetHeight;
const headerBottomHeight = headerBottomPC.offsetHeight;

// Create a wrapper for the entire header if it doesn't exist
let headerWrapper = headerTopPC.parentNode;
if (!headerWrapper.classList.contains('header-wrapper')) {
    // Create a wrapper only if needed
    headerWrapper = document.createElement('div');
    headerWrapper.classList.add('header-wrapper');
    headerTopPC.parentNode.insertBefore(headerWrapper, headerTopPC);
    headerWrapper.appendChild(headerTopPC);
    headerWrapper.appendChild(headerBottomPC);
}

// Set initial styles
document.head.insertAdjacentHTML('beforeend', `
<style>
    .header-wrapper {
        position: relative;
        width: 100%;
        z-index: 1000;
    }
    #header-top-pc {
        transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
        will-change: transform;
    }
    #header-bottom-pc {
        transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1),
                    box-shadow 0.4s cubic-bezier(0.33, 1, 0.68, 1);
        will-change: transform, box-shadow;
        backface-visibility: hidden;
    }
    #header-bottom-pc.fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
    }
    .header-placeholder {
        display: none;
    }
</style>
`);

// Create placeholder to prevent content jumps
const placeholder = document.createElement('div');
placeholder.classList.add('header-placeholder');
placeholder.style.height = `${headerBottomHeight}px`;
headerWrapper.parentNode.insertBefore(placeholder, headerWrapper.nextSibling);

// Variables for scroll handling
let lastScrollTop = 0;
let ticking = false;
let isHeaderHidden = false;
let scrollDirection = 'none';
let lastScrollDirection = 'none';
let scrollDelta = 0;
const scrollThreshold = 5;

// Main scroll handling function with improved animation
function updateHeader() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determine scroll direction & calculate delta (how fast scrolling happens)
    scrollDirection = currentScroll > lastScrollTop ? 'down' : 'up';
    scrollDelta = Math.abs(currentScroll - lastScrollTop);
    
    // Save last direction for transition smoothing
    if (scrollDirection !== lastScrollDirection) {
        // Direction changed, reset animations for smoother transition
        headerTopPC.style.transition = `transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)`;
        headerBottomPC.style.transition = `transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), 
                                          box-shadow 0.4s cubic-bezier(0.33, 1, 0.68, 1)`;
    } else if (scrollDelta > 50) {
        // Fast scrolling, make animations quicker
        headerTopPC.style.transition = `transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)`;
        headerBottomPC.style.transition = `transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), 
                                          box-shadow 0.3s cubic-bezier(0.33, 1, 0.68, 1)`;
    }
    
    if (scrollDirection === 'down' && currentScroll > headerTopHeight) {
        // Scrolling down past the header top
        if (!isHeaderHidden && scrollDelta > scrollThreshold) {
            // Hide top header with easing animation
            headerTopPC.style.transform = `translateY(-${headerTopHeight}px)`;
            
            // Fix bottom header to the top
            headerBottomPC.classList.add('fixed');
            placeholder.style.display = 'block';
            
            // Add subtle entrance animation for bottom header
            headerBottomPC.style.transform = 'translateY(0)';
            headerBottomPC.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            
            isHeaderHidden = true;
        }
    } else if (scrollDirection === 'up') {
        if (currentScroll <= headerTopHeight) {
            // At the top of the page - fully restore original state
            headerTopPC.style.transform = 'translateY(0)';
            headerBottomPC.classList.remove('fixed');
            headerBottomPC.style.boxShadow = 'none';
            placeholder.style.display = 'none';
            isHeaderHidden = false;
        } else if (scrollDelta > scrollThreshold * 2 && isHeaderHidden) {
            // Scrolling up with enough momentum and header is hidden 
            // Keep bottom header fixed but ensure it's visible
            headerBottomPC.style.transform = 'translateY(0)';
            headerBottomPC.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        }
    }
    
    // Save values for next scroll event
    lastScrollTop = currentScroll;
    lastScrollDirection = scrollDirection;
    ticking = false;
}

// Use requestAnimationFrame for performance and smooth animations
function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
}

// Listen for scroll events
window.addEventListener('scroll', onScroll, { passive: true });

// Handle page refresh in the middle of the page
window.addEventListener('load', () => {
    // Force recalculation of heights
    const refreshTopHeight = headerTopPC.offsetHeight;
    const refreshBottomHeight = headerBottomPC.offsetHeight;
    placeholder.style.height = `${refreshBottomHeight}px`;
    
    // Set proper state based on current scroll position
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > refreshTopHeight) {
        headerTopPC.style.transform = `translateY(-${refreshTopHeight}px)`;
        headerBottomPC.classList.add('fixed');
        headerBottomPC.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        placeholder.style.display = 'block';
        isHeaderHidden = true;
    }
});

// Update measurements on window resize
window.addEventListener('resize', () => {
    // Recalculate heights to handle responsive design
    const newTopHeight = headerTopPC.offsetHeight;
    const newBottomHeight = headerBottomPC.offsetHeight;
    placeholder.style.height = `${newBottomHeight}px`;
    
    // Update transform value if header is hidden
    if (isHeaderHidden) {
        headerTopPC.style.transform = `translateY(-${newTopHeight}px)`;
    }
}, { passive: true });

// POPUP
// Hàm mở popup
function openPopup() {
    document.getElementById('popupOverlay').classList.add('show');
    // document.body.style.overflow = 'hidden'; // Ngăn cuộn trang
  }
  
  // Hàm đóng popup
  function closePopup() {
    document.getElementById('popupOverlay').classList.remove('show');
    // document.body.style.overflow = ''; // Khôi phục cuộn trang
  }
  // Hàm đóng popup khi click vào overlay (vùng bên ngoài form)
document.getElementById('popupOverlay').addEventListener('click', function(event) {
    // Nếu click trực tiếp vào overlay (không phải vào phần nội dung form)
    if (event.target === this) {
      closePopup();
    }
  });

  // POPUP
// Hàm mở popup
function openPopupLogin() {
    document.getElementById('popupOverlay-login').classList.add('show');
    // document.body.style.overflow = 'hidden'; // Ngăn cuộn trang
  }
  
  // Hàm đóng popup
  function closePopupLogin() {
    document.getElementById('popupOverlay-login').classList.remove('show');
    // document.body.style.overflow = ''; // Khôi phục cuộn trang
  }
  // Hàm đóng popup khi click vào overlay (vùng bên ngoài form)
document.getElementById('popupOverlay-login').addEventListener('click', function(event) {
    // Nếu click trực tiếp vào overlay (không phải vào phần nội dung form)
    if (event.target === this) {
      closePopupLogin();
    }
  });



