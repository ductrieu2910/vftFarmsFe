document.addEventListener("DOMContentLoaded", function() {
  const cartButton = document.getElementById("cartButton");
  const cartDropdown = document.getElementById("cartDropdown");
  const headerBottom = document.getElementById("header-bottom-pc");
  
  // Toggle cart dropdown when cart button is clicked
  cartButton.addEventListener("click", function() {
    cartDropdown.classList.toggle("show1");
    updateCartPosition();
  });
  
  // Close dropdown when clicking outside
  document.addEventListener("click", function(event) {
    if (!cartButton.contains(event.target) && !cartDropdown.contains(event.target)) {
      cartDropdown.classList.remove("show1");
    }
  });
  
  // Update cart position on scroll
  window.addEventListener("scroll", function() {
    if (cartDropdown.classList.contains("show1")) {
      updateCartPosition();
    }
  });
  
  // Update cart position on window resize
  window.addEventListener("resize", function() {
    if (cartDropdown.classList.contains("show1")) {
      updateCartPosition();
    }
  });
  
  // Function to update cart dropdown position
  function updateCartPosition() {
    if (cartDropdown.classList.contains("show1")) {
      const headerRect = headerBottom.getBoundingClientRect();
      const cartButtonRect = cartButton.getBoundingClientRect();
      
      // Adjust dropdown position based on header's position
      cartDropdown.style.position = "fixed";
      cartDropdown.style.top = (headerRect.bottom + 5) + "px";
      
      // Calculate position from right edge of viewport to match cart button's position
      const rightPosition = window.innerWidth - (cartButtonRect.right);
      cartDropdown.style.right = rightPosition + "px";
    }
  }
});

