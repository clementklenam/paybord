// This script adds a direct navigation button that guarantees data preservation
// Add this to your browser console when you're on step 3 (Customize Design)

// Function to add emergency navigation button
function addEmergencyNavButton() {
  const customizeStep = document.querySelector('.card');
  if (!customizeStep) return;
  
  // Create emergency navigation container
  const emergencyNav = document.createElement('div');
  emergencyNav.style.padding = '20px';
  emergencyNav.style.margin = '20px 0';
  emergencyNav.style.backgroundColor = '#fef3c7';
  emergencyNav.style.border = '2px solid #f59e0b';
  emergencyNav.style.borderRadius = '8px';
  
  // Create title
  const title = document.createElement('h3');
  title.textContent = 'Emergency Navigation';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  emergencyNav.appendChild(title);
  
  // Create description
  const desc = document.createElement('p');
  desc.textContent = 'If the Continue button is not working, use this button to navigate directly to the Preview step.';
  desc.style.marginBottom = '15px';
  emergencyNav.appendChild(desc);
  
  // Create button
  const button = document.createElement('button');
  button.textContent = 'Skip to Preview & Launch';
  button.style.backgroundColor = '#ef4444';
  button.style.color = 'white';
  button.style.padding = '10px 16px';
  button.style.borderRadius = '6px';
  button.style.fontWeight = 'bold';
  button.style.cursor = 'pointer';
  button.style.border = 'none';
  
  // Add click event
  button.addEventListener('click', () => {
    // Get current form data
    const formData = {};
    
    // Store name and description
    const storeName = document.getElementById('store-name')?.value;
    const storeDesc = document.getElementById('store-description')?.value;
    if (storeName) formData.name = storeName;
    if (storeDesc) formData.description = storeDesc;
    
    // Get colors
    const primaryColorInput = document.querySelector('input[type="color"]');
    if (primaryColorInput) formData.primaryColor = primaryColorInput.value;
    
    // Save to localStorage
    localStorage.setItem('emergency_store_data', JSON.stringify(formData));
    localStorage.setItem('emergency_goto_step', '4');
    
    // Navigate to same page to reload
    window.location.href = window.location.pathname + '?forceStep=4';
  });
  
  emergencyNav.appendChild(button);
  
  // Add to page
  customizeStep.appendChild(emergencyNav);
  
  console.log('Emergency navigation button added');
}

// Execute
addEmergencyNavButton();
