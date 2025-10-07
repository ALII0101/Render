// class MenuApp {
//     constructor() {
//         this.items = [];
//         this.currentEditingId = null;
//         this.init();
//     }

//     init() {
//         this.loadItems();
//         this.setupEventListeners();
//     }

//     setupEventListeners() {
//         document.getElementById('itemForm').addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.saveItem();
//         });
//     }

//     async loadItems() {
//         try {
//             this.showLoading();
//             const response = await fetch('/api/items');
//             this.items = await response.json();
//             this.renderItems();
//         } catch (error) {
//             this.showError('Failed to load menu items');
//             console.error('Error loading items:', error);
//         }
//     }

//     renderItems() {
//         const container = document.getElementById('menuItems');

//         if (this.items.length === 0) {
//             container.innerHTML = '<div class="loading">No menu items found. Add your first item!</div>';
//             return;
//         }

//         container.innerHTML = this.items.map(item => `
//             <div class="menu-item" data-id="${item.id}">
//                 <h3>${this.escapeHtml(item.name)}</h3>
//                 <div class="price">$${item.price.toFixed(2)}</div>
//                 ${item.description ? `<div class="description">${this.escapeHtml(item.description)}</div>` : ''}
//                 <div class="actions">
//                     <button class="btn btn-edit" onclick="app.editItem(${item.id})">Edit</button>
//                     <button class="btn btn-delete" onclick="app.deleteItem(${item.id})">Delete</button>
//                 </div>
//             </div>
//         `).join('');
//     }

//     async saveItem() {
//         const formData = {
//             name: document.getElementById('name').value.trim(),
//             price: parseFloat(document.getElementById('price').value),
//             description: document.getElementById('description').value.trim()
//         };

//         if (!formData.name || isNaN(formData.price)) {
//             this.showError('Please fill in all required fields');
//             return;
//         }

//         try {
//             if (this.currentEditingId) {
//                 // Update existing item
//                 await fetch(`/api/items/${this.currentEditingId}`, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(formData)
//                 });
//                 this.showMessage('Item updated successfully', 'success');
//             } else {
//                 // Add new item
//                 await fetch('/api/items', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(formData)
//                 });
//                 this.showMessage('Item added successfully', 'success');
//             }

//             this.closeModal();
//             this.loadItems();
//         } catch (error) {
//             this.showError('Failed to save item');
//             console.error('Error saving item:', error);
//         }
//     }

//     async deleteItem(itemId) {
//         if (!confirm('Are you sure you want to delete this item?')) {
//             return;
//         }

//         try {
//             await fetch(`/api/items/${itemId}`, {
//                 method: 'DELETE'
//             });

//             this.showMessage('Item deleted successfully', 'success');
//             this.loadItems();
//         } catch (error) {
//             this.showError('Failed to delete item');
//             console.error('Error deleting item:', error);
//         }
//     }

//     editItem(itemId) {
//         const item = this.items.find(i => i.id === itemId);
//         if (!item) return;

//         this.currentEditingId = itemId;
//         document.getElementById('modalTitle').textContent = 'Edit Item';
//         document.getElementById('itemId').value = itemId;
//         document.getElementById('name').value = item.name;
//         document.getElementById('price').value = item.price;
//         document.getElementById('description').value = item.description || '';

//         this.openModal();
//     }

//     openModal() {
//         document.getElementById('itemModal').style.display = 'block';
//     }

//     closeModal() {
//         document.getElementById('itemModal').style.display = 'none';
//         this.resetForm();
//     }

//     resetForm() {
//         document.getElementById('itemForm').reset();
//         document.getElementById('modalTitle').textContent = 'Add New Item';
//         document.getElementById('itemId').value = '';
//         this.currentEditingId = null;
//     }

//     showLoading() {
//         const container = document.getElementById('menuItems');
//         container.innerHTML = '<div class="loading">Loading menu items...</div>';
//     }

//     showError(message) {
//         this.showMessage(message, 'error');
//     }

//     showMessage(message, type) {
//         // Remove any existing messages
//         const existingMessage = document.querySelector('.message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         const messageDiv = document.createElement('div');
//         messageDiv.className = `message ${type}`;
//         messageDiv.textContent = message;

//         const container = document.querySelector('.container');
//         container.insertBefore(messageDiv, container.firstChild);

//         // Auto-remove after 5 seconds
//         setTimeout(() => {
//             if (messageDiv.parentNode) {
//                 messageDiv.remove();
//             }
//         }, 5000);
//     }

//     escapeHtml(unsafe) {
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }
// }

// // Global functions for HTML onclick events
// function openModal() {
//     app.openModal();
// }

// function closeModal() {
//     app.closeModal();
// }

// // Initialize the app when the page loads
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     app = new MenuApp();
// });

// // Close modal when clicking outside
// window.onclick = function (event) {
//     const modal = document.getElementById('itemModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// }


// class RestaurantManagementSystem {
//     constructor() {
//         this.items = [];
//         this.categories = [];
//         this.currentEditingId = null;
//         this.init();
//     }

//     async refreshData() {
//         await this.loadItems();
//         await this.loadCategories();
//         this.renderItems();
//         this.updateStatistics();

//         // If on database section, refresh that too
//         if (document.getElementById('databaseSection').classList.contains('active')) {
//             await this.loadDatabaseInfo();
//         }
//     }

//     init() {
//         this.loadItems();
//         this.loadCategories();
//         this.setupEventListeners();
//         this.setupImageUpload();
//     }

//     setupEventListeners() {
//         document.getElementById('itemForm').addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.saveItem();
//         });

//         document.getElementById('searchInput').addEventListener('input', (e) => {
//             this.filterItems();
//         });

//         document.getElementById('categoryFilter').addEventListener('change', (e) => {
//             this.filterItems();
//         });

//         document.getElementById('availabilityFilter').addEventListener('change', (e) => {
//             this.filterItems();
//         });

//         // Navigation
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.switchSection(item.dataset.section);
//             });
//         });
//     }

//     setupImageUpload() {
//         const imageInput = document.getElementById('image');
//         const imagePreview = document.getElementById('imagePreview');

//         imageInput.addEventListener('change', (e) => {
//             const file = e.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
//                     imagePreview.classList.add('has-image');
//                 };
//                 reader.readAsDataURL(file);
//             }
//         });

//         imagePreview.addEventListener('click', () => {
//             imageInput.click();
//         });
//     }

//     switchSection(section) {
//         // Update active nav item
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         document.querySelector(`[data-section="${section}"]`).classList.add('active');

//         // Hide all sections
//         document.querySelectorAll('.section').forEach(sec => {
//             sec.classList.remove('active');
//         });

//         // Show active section
//         document.getElementById(`${section}Section`).classList.add('active');

//         // Update page title
//         const titles = {
//             'menu': 'Menu Management',
//             'categories': 'Categories',
//             'analytics': 'Analytics',
//             'database': 'Database Information'
//         };

//         const descriptions = {
//             'menu': 'Manage your restaurant menu items',
//             'categories': 'View menu categories and distribution',
//             'analytics': 'Track your restaurant performance and sales',
//             'database': 'View and manage your restaurant database'
//         };

//         document.getElementById('pageTitle').textContent = titles[section] || 'Restaurant Management';
//         document.getElementById('pageDescription').textContent = descriptions[section] || '';

//         // Load section-specific data
//         if (section === 'database') {
//             this.loadDatabaseInfo();
//         } else if (section === 'analytics') {
//             this.loadAnalytics();
//         } else if (section === 'categories') {
//             this.loadCategories();
//         }
//     }

//     async loadDatabaseInfo() {
//         try {
//             const [dbInfoResponse, dbItemsResponse] = await Promise.all([
//                 fetch('/api/database/info'),
//                 fetch('/api/database/items')
//             ]);

//             if (!dbInfoResponse.ok || !dbItemsResponse.ok) {
//                 throw new Error('Failed to load database info');
//             }

//             const dbInfo = await dbInfoResponse.json();
//             const dbItems = await dbItemsResponse.json();

//             this.renderDatabaseInfo(dbInfo);
//             this.renderDatabaseItems(dbItems);
//         } catch (error) {
//             this.showError('Failed to load database information');
//             console.error('Error loading database info:', error);
//         }
//     }

//     renderDatabaseInfo(dbInfo) {
//         const statsContainer = document.getElementById('databaseStats');
//         if (!statsContainer) return;

//         statsContainer.innerHTML = `
//             <div class="db-stat">
//                 <span class="label">Total Items:</span>
//                 <span class="value">${dbInfo.total_items}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Categories:</span>
//                 <span class="value">${dbInfo.categories_count}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Database Size:</span>
//                 <span class="value">${dbInfo.db_size_mb} MB</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Last Updated:</span>
//                 <span class="value">${new Date(dbInfo.last_updated).toLocaleString()}</span>
//             </div>
//         `;
//     }

//     renderDatabaseItems(items) {
//         const tableBody = document.querySelector('#databaseTable tbody');
//         if (!tableBody) return;

//         if (items.length === 0) {
//             tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">
//                         <i class="fas fa-database" style="font-size: 3rem; margin-bottom: 10px; display: block;"></i>
//                         <h3>No items in database</h3>
//                         <p>Add your first menu item to see it here!</p>
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         tableBody.innerHTML = items.map(item => `
//             <tr>
//                 <td>${item.id}</td>
//                 <td>
//                     <strong>${this.escapeHtml(item.name)}</strong>
//                     ${item.description ? `<br><small style="color: var(--gray);">${this.escapeHtml(item.description.substring(0, 50))}${item.description.length > 50 ? '...' : ''}</small>` : ''}
//                 </td>
//                 <td>$${item.price.toFixed(2)}</td>
//                 <td>
//                     <span class="item-category">${this.escapeHtml(item.category)}</span>
//                 </td>
//                 <td>
//                     <span class="sales-badge">${item.sales_count} sales</span>
//                 </td>
//                 <td>
//                     <span class="${item.is_available ? 'status-available' : 'status-unavailable'}">
//                         ${item.is_available ? 'Available' : 'Unavailable'}
//                     </span>
//                 </td>
//                 <td>
//                     <small>${item.created_at}</small>
//                     ${item.last_ordered !== 'Never' ? `<br><small style="color: var(--gray);">Last order: ${item.last_ordered}</small>` : ''}
//                 </td>
//             </tr>
//         `).join('');
//     }

//     async loadItems() {
//         try {
//             this.showLoading(true);
//             const category = document.getElementById('categoryFilter').value;
//             const availability = document.getElementById('availabilityFilter').value;

//             let url = '/api/items';
//             const params = [];

//             if (category !== 'all') {
//                 params.push(`category=${category}`);
//             }

//             if (params.length > 0) {
//                 url += '?' + params.join('&');
//             }

//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Failed to load items');

//             let items = await response.json();

//             // تطبيق تصفية التوفر على جانب العميل
//             if (availability !== 'all') {
//                 items = items.filter(item =>
//                     availability === 'available' ? item.is_available : !item.is_available
//                 );
//             }

//             this.items = items;
//             this.renderItems();
//             this.updateStatistics();
//         } catch (error) {
//             this.showError('Failed to load menu items');
//             console.error('Error loading items:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async loadCategories() {
//         try {
//             const response = await fetch('/api/items/categories');
//             this.categories = await response.json();
//             this.populateCategoryFilter();
//         } catch (error) {
//             console.error('Error loading categories:', error);
//         }
//     }

//     populateCategoryFilter() {
//         const filter = document.getElementById('categoryFilter');
//         // Keep "All Categories" option
//         filter.innerHTML = '<option value="all">All Categories</option>';

//         this.categories.forEach(category => {
//             const option = document.createElement('option');
//             option.value = category;
//             option.textContent = category;
//             filter.appendChild(option);
//         });
//     }

//     renderItems() {
//         const container = document.getElementById('menuItems');
//         const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//         const availabilityFilter = document.getElementById('availabilityFilter').value;

//         let filteredItems = this.items.filter(item => {
//             const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
//                 item.description.toLowerCase().includes(searchTerm);
//             const matchesAvailability = availabilityFilter === 'all' ||
//                 (availabilityFilter === 'available' && item.is_available) ||
//                 (availabilityFilter === 'unavailable' && !item.is_available);

//             return matchesSearch && matchesAvailability;
//         });

//         if (filteredItems.length === 0) {
//             container.innerHTML = `
//                 <div class="no-items">
//                     <i class="fas fa-utensils"></i>
//                     <h3>No menu items found</h3>
//                     <p>Try adjusting your search or filters</p>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = filteredItems.map(item => `
//             <div class="menu-item ${!item.is_available ? 'unavailable' : ''}" data-id="${item.id}">
//                 <div class="item-image">
//                     ${item.image_url ?
//                 `<img src="${item.image_url}" alt="${this.escapeHtml(item.name)}" onerror="this.style.display='none'">` :
//                 `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
//             }
//                 </div>
//                 <div class="item-info">
//                     <div class="item-header">
//                         <h3>${this.escapeHtml(item.name)}</h3>
//                         <div class="item-price">$${item.price.toFixed(2)}</div>
//                     </div>
//                     <div class="item-category">${this.escapeHtml(item.category)}</div>
//                     ${item.description ? `<div class="item-description">${this.escapeHtml(item.description)}</div>` : ''}
//                     <div class="item-actions">
//                         <button class="btn btn-edit btn-sm" onclick="app.editItem(${item.id})">
//                             <i class="fas fa-edit"></i> Edit
//                         </button>
//                         <button class="btn btn-delete btn-sm" onclick="app.deleteItem(${item.id})">
//                             <i class="fas fa-trash"></i> Delete
//                         </button>
//                         <button class="btn ${item.is_available ? 'btn-secondary' : 'btn-primary'} btn-sm" 
//                                 onclick="app.toggleAvailability(${item.id})">
//                             <i class="fas ${item.is_available ? 'fa-eye-slash' : 'fa-eye'}"></i>
//                             ${item.is_available ? 'Hide' : 'Show'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');
//     }

//     filterItems() {
//         this.renderItems();
//         this.updateStatistics(); // ✅ تحديث الإحصائيات أيضاً
//     }

//     async saveItem() {
//         const formData = new FormData();
//         const itemId = document.getElementById('itemId').value;

//         formData.append('name', document.getElementById('name').value.trim());
//         formData.append('price', document.getElementById('price').value);
//         formData.append('description', document.getElementById('description').value.trim());
//         formData.append('category', document.getElementById('category').value);
//         formData.append('is_available', document.getElementById('availability').value);

//         const imageFile = document.getElementById('image').files[0];
//         if (imageFile) {
//             formData.append('image', imageFile);
//         }

//         if (!formData.get('name') || !formData.get('price')) {
//             this.showError('Please fill in all required fields');
//             return;
//         }

//         try {
//             this.showLoading(true);

//             let response;
//             if (this.currentEditingId) {
//                 response = await fetch(`/api/items/${this.currentEditingId}`, {
//                     method: 'PUT',
//                     body: formData
//                 });
//             } else {
//                 response = await fetch('/api/items', {
//                     method: 'POST',
//                     body: formData
//                 });
//             }

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.error || 'Failed to save item');
//             }

//             this.showMessage(
//                 this.currentEditingId ? 'Item updated successfully' : 'Item added successfully',
//                 'success'
//             );

//             this.closeModal();
//             await this.refreshData(); // ✅ تحديث كامل للبيانات

//         } catch (error) {
//             this.showError(error.message);
//             console.error('Error saving item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async deleteItem(itemId) {
//         if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
//             return;
//         }

//         try {
//             this.showLoading(true);
//             const response = await fetch(`/api/items/${itemId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) throw new Error('Failed to delete item');

//             this.showMessage('Item deleted successfully', 'success');
//             await this.refreshData(); // ✅ تحديث كامل للبيانات

//         } catch (error) {
//             this.showError('Failed to delete item');
//             console.error('Error deleting item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async toggleAvailability(itemId) {
//         try {
//             const response = await fetch(`/api/items/${itemId}/availability`, {
//                 method: 'PATCH'
//             });

//             if (!response.ok) throw new Error('Failed to update availability');

//             this.showMessage('Availability updated successfully', 'success');
//             await this.refreshData(); // ✅ تحديث كامل للبيانات

//         } catch (error) {
//             this.showError('Failed to update availability');
//             console.error('Error updating availability:', error);
//         }
//     }

//     editItem(itemId) {
//         const item = this.items.find(i => i.id === itemId);
//         if (!item) return;

//         this.currentEditingId = itemId;
//         document.getElementById('modalTitle').textContent = 'Edit Menu Item';
//         document.getElementById('itemId').value = itemId;
//         document.getElementById('name').value = item.name;
//         document.getElementById('price').value = item.price;
//         document.getElementById('description').value = item.description || '';
//         document.getElementById('category').value = item.category;
//         document.getElementById('availability').value = item.is_available.toString();

//         const imagePreview = document.getElementById('imagePreview');
//         if (item.image_url) {
//             imagePreview.innerHTML = `<img src="${item.image_url}" alt="Preview">`;
//             imagePreview.classList.add('has-image');
//         } else {
//             imagePreview.innerHTML = `
//                 <i class="fas fa-cloud-upload-alt"></i>
//                 <p>Click to upload image</p>
//             `;
//             imagePreview.classList.remove('has-image');
//         }

//         this.openModal();
//     }

//     updateStatistics() {
//         const totalItems = this.items.length;
//         const availableItems = this.items.filter(item => item.is_available).length;
//         const unavailableItems = totalItems - availableItems;
//         const totalCategories = new Set(this.items.map(item => item.category)).size;

//         document.getElementById('totalItems').textContent = totalItems;
//         document.getElementById('availableItems').textContent = availableItems;
//         document.getElementById('unavailableItems').textContent = unavailableItems;
//         document.getElementById('totalCategories').textContent = totalCategories;
//     }

//     openModal() {
//         document.getElementById('itemModal').style.display = 'block';
//     }

//     closeModal() {
//         document.getElementById('itemModal').style.display = 'none';
//         this.resetForm();
//     }

//     resetForm() {
//         document.getElementById('itemForm').reset();
//         document.getElementById('modalTitle').textContent = 'Add New Menu Item';
//         document.getElementById('itemId').value = '';

//         const imagePreview = document.getElementById('imagePreview');
//         imagePreview.innerHTML = `
//             <i class="fas fa-cloud-upload-alt"></i>
//             <p>Click to upload image</p>
//         `;
//         imagePreview.classList.remove('has-image');

//         this.currentEditingId = null;
//     }

//     showLoading(show) {
//         const spinner = document.getElementById('loadingSpinner');
//         spinner.style.display = show ? 'flex' : 'none';
//     }

//     showError(message) {
//         this.showMessage(message, 'error');
//     }

//     showMessage(message, type) {
//         // Remove any existing messages
//         const existingMessage = document.querySelector('.message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         const messageDiv = document.createElement('div');
//         messageDiv.className = `message ${type}`;
//         messageDiv.innerHTML = `
//             <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
//             ${message}
//         `;

//         const mainContent = document.querySelector('.main-content');
//         mainContent.insertBefore(messageDiv, mainContent.firstChild);

//         // Auto-remove after 5 seconds
//         setTimeout(() => {
//             if (messageDiv.parentNode) {
//                 messageDiv.remove();
//             }
//         }, 5000);
//     }

//     escapeHtml(unsafe) {
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }

//     // Placeholder methods for other sections
//     async loadAnalytics() {
//         // سيتم تنفيذ هذا لاحقاً
//         console.log('Loading analytics...');
//     }
// }

// // Global functions for HTML onclick events
// function openModal() {
//     app.openModal();
// }

// function closeModal() {
//     app.closeModal();
// }

// // Initialize the app when the page loads
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     app = new RestaurantManagementSystem();
// });

// // Close modal when clicking outside
// window.onclick = function (event) {
//     const modal = document.getElementById('itemModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// }





// class RestaurantManagementSystem {
//     constructor() {
//         this.items = [];
//         this.categories = [];
//         this.currentEditingId = null;
//         this.init();
//     }

//     async refreshData() {
//         await this.loadItems();
//         await this.loadCategories();
//         this.renderItems();
//         this.updateStatistics();

//         // If on database section, refresh that too
//         if (document.getElementById('databaseSection').classList.contains('active')) {
//             await this.loadDatabaseInfo();
//         }
//     }

//     init() {
//         this.loadItems();
//         this.loadCategories();
//         this.setupEventListeners();
//         this.setupImageUpload();
//     }

//     setupEventListeners() {
//         document.getElementById('itemForm').addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.saveItem();
//         });

//         document.getElementById('searchInput').addEventListener('input', (e) => {
//             this.filterItems();
//         });

//         document.getElementById('categoryFilter').addEventListener('change', (e) => {
//             this.filterItems();
//         });

//         document.getElementById('availabilityFilter').addEventListener('change', (e) => {
//             this.filterItems();
//         });

//         // Navigation
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.switchSection(item.dataset.section);
//             });
//         });
//     }

//     setupImageUpload() {
//         const imageInput = document.getElementById('image');
//         const imagePreview = document.getElementById('imagePreview');

//         imageInput.addEventListener('change', (e) => {
//             const file = e.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
//                     imagePreview.classList.add('has-image');
//                 };
//                 reader.readAsDataURL(file);
//             }
//         });

//         imagePreview.addEventListener('click', () => {
//             imageInput.click();
//         });
//     }

//     switchSection(section) {
//         // Update active nav item
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         document.querySelector(`[data-section="${section}"]`).classList.add('active');

//         // Hide all sections
//         document.querySelectorAll('.section').forEach(sec => {
//             sec.classList.remove('active');
//         });

//         // Show active section
//         document.getElementById(`${section}Section`).classList.add('active');

//         // Update page title
//         const titles = {
//             'menu': 'Menu Management',
//             'categories': 'Categories',
//             'analytics': 'Analytics',
//             'database': 'Database Information'
//         };

//         const descriptions = {
//             'menu': 'Manage your restaurant menu items',
//             'categories': 'View menu categories and distribution',
//             'analytics': 'Track your restaurant performance and sales',
//             'database': 'View and manage your restaurant database'
//         };

//         document.getElementById('pageTitle').textContent = titles[section] || 'Restaurant Management';
//         document.getElementById('pageDescription').textContent = descriptions[section] || '';

//         // Load section-specific data
//         if (section === 'database') {
//             this.loadDatabaseInfo();
//         } else if (section === 'analytics') {
//             this.loadAnalytics();
//         } else if (section === 'categories') {
//             this.loadCategories();
//         }
//     }

//     // ==================== NEW CATEGORIES METHODS ====================
//     async loadCategories() {
//         try {
//             const response = await fetch('/api/categories/stats');
//             if (!response.ok) throw new Error('Failed to load categories');

//             const categories = await response.json();
//             this.renderCategories(categories);
//         } catch (error) {
//             this.showError('Failed to load categories');
//             console.error('Error loading categories:', error);
//         }
//     }

//     renderCategories(categories) {
//         const container = document.getElementById('categoriesGrid');
//         if (!container) return;

//         if (categories.length === 0) {
//             container.innerHTML = `
//                 <div class="no-categories">
//                     <i class="fas fa-tags" style="font-size: 4rem; margin-bottom: 20px; color: var(--gray);"></i>
//                     <h3>No Categories Found</h3>
//                     <p>Add menu items to see categories here</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = categories.map(cat => `
//             <div class="category-card">
//                 <div class="category-header">
//                     <h3>${this.escapeHtml(cat.name)}</h3>
//                     <span class="category-badge">${cat.item_count} items</span>
//                 </div>

//                 <div class="category-stats">
//                     <div class="stat">
//                         <div class="number">${cat.item_count}</div>
//                         <div class="label">Total Items</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.available_items}</div>
//                         <div class="label">Available</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.total_sales}</div>
//                         <div class="label">Total Sales</div>
//                     </div>
//                 </div>

//                 <div class="category-details">
//                     <div class="detail-item">
//                         <i class="fas fa-dollar-sign"></i>
//                         <span>Average Price: $${cat.avg_price ? cat.avg_price.toFixed(2) : '0.00'}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-chart-line"></i>
//                         <span>Sales Performance: ${this.getSalesPerformance(cat.total_sales)}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-percentage"></i>
//                         <span>Availability: ${cat.item_count > 0 ? Math.round((cat.available_items / cat.item_count) * 100) : 0}%</span>
//                     </div>
//                 </div>

//                 <div class="category-actions">
//                     <button class="btn btn-sm btn-primary" onclick="app.filterByCategory('${cat.name}')">
//                         <i class="fas fa-eye"></i> View Items
//                     </button>
//                     <button class="btn btn-sm btn-secondary" onclick="app.viewCategoryAnalytics('${cat.name}')">
//                         <i class="fas fa-chart-bar"></i> Analytics
//                     </button>
//                 </div>
//             </div>
//         `).join('');
//     }

//     getSalesPerformance(sales) {
//         if (sales === 0) return 'No sales';
//         if (sales < 10) return 'Low';
//         if (sales < 50) return 'Medium';
//         if (sales < 100) return 'High';
//         return 'Excellent';
//     }

//     filterByCategory(category) {
//         // Switch to menu section and filter by category
//         this.switchSection('menu');
//         document.getElementById('categoryFilter').value = category;
//         this.filterItems();

//         this.showMessage(`Showing items in: ${category}`, 'success');
//     }

//     viewCategoryAnalytics(category) {
//         this.switchSection('analytics');
//         this.showMessage(`Viewing analytics for: ${category}`, 'success');
//     }
//     // ==================== END NEW CATEGORIES METHODS ====================

//     async loadDatabaseInfo() {
//         try {
//             const [dbInfoResponse, dbItemsResponse] = await Promise.all([
//                 fetch('/api/database/info'),
//                 fetch('/api/database/items')
//             ]);

//             if (!dbInfoResponse.ok || !dbItemsResponse.ok) {
//                 throw new Error('Failed to load database info');
//             }

//             const dbInfo = await dbInfoResponse.json();
//             const dbItems = await dbItemsResponse.json();

//             this.renderDatabaseInfo(dbInfo);
//             this.renderDatabaseItems(dbItems);
//         } catch (error) {
//             this.showError('Failed to load database information');
//             console.error('Error loading database info:', error);
//         }
//     }

//     renderDatabaseInfo(dbInfo) {
//         const statsContainer = document.getElementById('databaseStats');
//         if (!statsContainer) return;

//         statsContainer.innerHTML = `
//             <div class="db-stat">
//                 <span class="label">Total Items:</span>
//                 <span class="value">${dbInfo.total_items}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Categories:</span>
//                 <span class="value">${dbInfo.categories_count}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Database Size:</span>
//                 <span class="value">${dbInfo.db_size_mb} MB</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Last Updated:</span>
//                 <span class="value">${new Date(dbInfo.last_updated).toLocaleString()}</span>
//             </div>
//         `;
//     }

//     renderDatabaseItems(items) {
//         const tableBody = document.querySelector('#databaseTable tbody');
//         if (!tableBody) return;

//         if (items.length === 0) {
//             tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">
//                         <i class="fas fa-database" style="font-size: 3rem; margin-bottom: 10px; display: block;"></i>
//                         <h3>No items in database</h3>
//                         <p>Add your first menu item to see it here!</p>
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         tableBody.innerHTML = items.map(item => `
//             <tr>
//                 <td>${item.id}</td>
//                 <td>
//                     <strong>${this.escapeHtml(item.name)}</strong>
//                     ${item.description ? `<br><small style="color: var(--gray);">${this.escapeHtml(item.description.substring(0, 50))}${item.description.length > 50 ? '...' : ''}</small>` : ''}
//                 </td>
//                 <td>$${item.price.toFixed(2)}</td>
//                 <td>
//                     <span class="item-category">${this.escapeHtml(item.category)}</span>
//                 </td>
//                 <td>
//                     <span class="sales-badge">${item.sales_count} sales</span>
//                 </td>
//                 <td>
//                     <span class="${item.is_available ? 'status-available' : 'status-unavailable'}">
//                         ${item.is_available ? 'Available' : 'Unavailable'}
//                     </span>
//                 </td>
//                 <td>
//                     <small>${item.created_at}</small>
//                     ${item.last_ordered !== 'Never' ? `<br><small style="color: var(--gray);">Last order: ${item.last_ordered}</small>` : ''}
//                 </td>
//             </tr>
//         `).join('');
//     }

//     async loadItems() {
//         try {
//             this.showLoading(true);
//             const category = document.getElementById('categoryFilter').value;
//             const availability = document.getElementById('availabilityFilter').value;

//             let url = '/api/items';
//             const params = [];

//             if (category !== 'all') {
//                 params.push(`category=${category}`);
//             }

//             if (params.length > 0) {
//                 url += '?' + params.join('&');
//             }

//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Failed to load items');

//             let items = await response.json();

//             // تطبيق تصفية التوفر على جانب العميل
//             if (availability !== 'all') {
//                 items = items.filter(item =>
//                     availability === 'available' ? item.is_available : !item.is_available
//                 );
//             }

//             this.items = items;
//             this.renderItems();
//             this.updateStatistics();
//         } catch (error) {
//             this.showError('Failed to load menu items');
//             console.error('Error loading items:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async loadCategoriesOld() {
//         try {
//             const response = await fetch('/api/items/categories');
//             this.categories = await response.json();
//             this.populateCategoryFilter();
//         } catch (error) {
//             console.error('Error loading categories:', error);
//         }
//     }

//     populateCategoryFilter() {
//         const filter = document.getElementById('categoryFilter');
//         // Keep "All Categories" option
//         filter.innerHTML = '<option value="all">All Categories</option>';

//         this.categories.forEach(category => {
//             const option = document.createElement('option');
//             option.value = category;
//             option.textContent = category;
//             filter.appendChild(option);
//         });
//     }

//     renderItems() {
//         const container = document.getElementById('menuItems');
//         const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//         const availabilityFilter = document.getElementById('availabilityFilter').value;

//         let filteredItems = this.items.filter(item => {
//             const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
//                 item.description.toLowerCase().includes(searchTerm);
//             const matchesAvailability = availabilityFilter === 'all' ||
//                 (availabilityFilter === 'available' && item.is_available) ||
//                 (availabilityFilter === 'unavailable' && !item.is_available);

//             return matchesSearch && matchesAvailability;
//         });

//         if (filteredItems.length === 0) {
//             container.innerHTML = `
//                 <div class="no-items">
//                     <i class="fas fa-utensils"></i>
//                     <h3>No menu items found</h3>
//                     <p>Try adjusting your search or filters</p>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = filteredItems.map(item => `
//             <div class="menu-item ${!item.is_available ? 'unavailable' : ''}" data-id="${item.id}">
//                 <div class="item-image">
//                     ${item.image_url ?
//                 `<img src="${item.image_url}" alt="${this.escapeHtml(item.name)}" onerror="this.style.display='none'">` :
//                 `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
//             }
//                 </div>
//                 <div class="item-info">
//                     <div class="item-header">
//                         <h3>${this.escapeHtml(item.name)}</h3>
//                         <div class="item-price">$${item.price.toFixed(2)}</div>
//                     </div>
//                     <div class="item-category">${this.escapeHtml(item.category)}</div>
//                     ${item.description ? `<div class="item-description">${this.escapeHtml(item.description)}</div>` : ''}
//                     <div class="item-actions">
//                         <button class="btn btn-edit btn-sm" onclick="app.editItem(${item.id})">
//                             <i class="fas fa-edit"></i> Edit
//                         </button>
//                         <button class="btn btn-delete btn-sm" onclick="app.deleteItem(${item.id})">
//                             <i class="fas fa-trash"></i> Delete
//                         </button>
//                         <button class="btn ${item.is_available ? 'btn-secondary' : 'btn-primary'} btn-sm" 
//                                 onclick="app.toggleAvailability(${item.id})">
//                             <i class="fas ${item.is_available ? 'fa-eye-slash' : 'fa-eye'}"></i>
//                             ${item.is_available ? 'Hide' : 'Show'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');
//     }

//     filterItems() {
//         this.renderItems();
//         this.updateStatistics(); // ✅ تحديث الإحصائيات أيضاً
//     }

//     async saveItem() {
//         const formData = new FormData();
//         const itemId = document.getElementById('itemId').value;

//         formData.append('name', document.getElementById('name').value.trim());
//         formData.append('price', document.getElementById('price').value);
//         formData.append('description', document.getElementById('description').value.trim());
//         formData.append('category', document.getElementById('category').value);
//         formData.append('is_available', document.getElementById('availability').value);

//         const imageFile = document.getElementById('image').files[0];
//         if (imageFile) {
//             formData.append('image', imageFile);
//         }

//         if (!formData.get('name') || !formData.get('price')) {
//             this.showError('Please fill in all required fields');
//             return;
//         }

//         try {
//             this.showLoading(true);

//             let response;
//             if (this.currentEditingId) {
//                 response = await fetch(`/api/items/${this.currentEditingId}`, {
//                     method: 'PUT',
//                     body: formData
//                 });
//             } else {
//                 response = await fetch('/api/items', {
//                     method: 'POST',
//                     body: formData
//                 });
//             }

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.error || 'Failed to save item');
//             }

//             this.showMessage(
//                 this.currentEditingId ? 'Item updated successfully' : 'Item added successfully',
//                 'success'
//             );

//             this.closeModal();
//             await this.refreshData(); // ✅ تحديث كامل للبيانات

//         } catch (error) {
//             this.showError(error.message);
//             console.error('Error saving item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async deleteItem(itemId) {
//         if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
//             return;
//         }

//         try {
//             this.showLoading(true);
//             const response = await fetch(`/api/items/${itemId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) throw new Error('Failed to delete item');

//             this.showMessage('Item deleted successfully', 'success');
//             await this.refreshData(); // ✅ تحديث كامل للبيانات

//         } catch (error) {
//             this.showError('Failed to delete item');
//             console.error('Error deleting item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async toggleAvailability(itemId) {
//         try {
//             const response = await fetch(`/api/items/${itemId}/availability`, {
//                 method: 'PATCH'
//             });

//             if (!response.ok) throw new Error('Failed to update availability');

//             this.showMessage('Availability updated successfully', 'success');
//             await this.refreshData(); // ✅ تحديث كامل للبيانات

//         } catch (error) {
//             this.showError('Failed to update availability');
//             console.error('Error updating availability:', error);
//         }
//     }

//     editItem(itemId) {
//         const item = this.items.find(i => i.id === itemId);
//         if (!item) return;

//         this.currentEditingId = itemId;
//         document.getElementById('modalTitle').textContent = 'Edit Menu Item';
//         document.getElementById('itemId').value = itemId;
//         document.getElementById('name').value = item.name;
//         document.getElementById('price').value = item.price;
//         document.getElementById('description').value = item.description || '';
//         document.getElementById('category').value = item.category;
//         document.getElementById('availability').value = item.is_available.toString();

//         const imagePreview = document.getElementById('imagePreview');
//         if (item.image_url) {
//             imagePreview.innerHTML = `<img src="${item.image_url}" alt="Preview">`;
//             imagePreview.classList.add('has-image');
//         } else {
//             imagePreview.innerHTML = `
//                 <i class="fas fa-cloud-upload-alt"></i>
//                 <p>Click to upload image</p>
//             `;
//             imagePreview.classList.remove('has-image');
//         }

//         this.openModal();
//     }

//     updateStatistics() {
//         const totalItems = this.items.length;
//         const availableItems = this.items.filter(item => item.is_available).length;
//         const unavailableItems = totalItems - availableItems;
//         const totalCategories = new Set(this.items.map(item => item.category)).size;

//         document.getElementById('totalItems').textContent = totalItems;
//         document.getElementById('availableItems').textContent = availableItems;
//         document.getElementById('unavailableItems').textContent = unavailableItems;
//         document.getElementById('totalCategories').textContent = totalCategories;
//     }

//     openModal() {
//         document.getElementById('itemModal').style.display = 'block';
//     }

//     closeModal() {
//         document.getElementById('itemModal').style.display = 'none';
//         this.resetForm();
//     }

//     resetForm() {
//         document.getElementById('itemForm').reset();
//         document.getElementById('modalTitle').textContent = 'Add New Menu Item';
//         document.getElementById('itemId').value = '';

//         const imagePreview = document.getElementById('imagePreview');
//         imagePreview.innerHTML = `
//             <i class="fas fa-cloud-upload-alt"></i>
//             <p>Click to upload image</p>
//         `;
//         imagePreview.classList.remove('has-image');

//         this.currentEditingId = null;
//     }

//     showLoading(show) {
//         const spinner = document.getElementById('loadingSpinner');
//         spinner.style.display = show ? 'flex' : 'none';
//     }

//     showError(message) {
//         this.showMessage(message, 'error');
//     }

//     showMessage(message, type) {
//         // Remove any existing messages
//         const existingMessage = document.querySelector('.message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         const messageDiv = document.createElement('div');
//         messageDiv.className = `message ${type}`;
//         messageDiv.innerHTML = `
//             <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
//             ${message}
//         `;

//         const mainContent = document.querySelector('.main-content');
//         mainContent.insertBefore(messageDiv, mainContent.firstChild);

//         // Auto-remove after 5 seconds
//         setTimeout(() => {
//             if (messageDiv.parentNode) {
//                 messageDiv.remove();
//             }
//         }, 5000);
//     }

//     escapeHtml(unsafe) {
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }

//     // Placeholder methods for other sections
//     async loadAnalytics() {
//         // سيتم تنفيذ هذا لاحقاً
//         console.log('Loading analytics...');
//     }
// }

// // Global functions for HTML onclick events
// function openModal() {
//     app.openModal();
// }

// function closeModal() {
//     app.closeModal();
// }

// // Initialize the app when the page loads
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     app = new RestaurantManagementSystem();
// });

// // Close modal when clicking outside
// window.onclick = function (event) {
//     const modal = document.getElementById('itemModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// }





// class RestaurantManagementSystem {
//     constructor() {
//         this.items = [];
//         this.categories = [];
//         this.currentEditingId = null;
//         this.salesChart = null;
//         this.categoryChart = null;
//         this.performanceChart = null;
//         this.init();
//     }

//     async refreshData() {
//         await this.loadItems();
//         await this.loadCategories();
//         this.renderItems();
//         this.updateStatistics();

//         // If on database section, refresh that too
//         if (document.getElementById('databaseSection').classList.contains('active')) {
//             await this.loadDatabaseInfo();
//         }
//     }

//     init() {
//         this.loadItems();
//         this.loadCategories();
//         this.setupEventListeners();
//         this.setupImageUpload();
//     }

//     setupEventListeners() {
//         document.getElementById('itemForm').addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.saveItem();
//         });

//         document.getElementById('searchInput').addEventListener('input', (e) => {
//             this.filterItems();
//         });

//         document.getElementById('categoryFilter').addEventListener('change', (e) => {
//             this.filterItems();
//         });

//         document.getElementById('availabilityFilter').addEventListener('change', (e) => {
//             this.filterItems();
//         });

//         // Navigation
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.switchSection(item.dataset.section);
//             });
//         });
//     }

//     setupImageUpload() {
//         const imageInput = document.getElementById('image');
//         const imagePreview = document.getElementById('imagePreview');

//         imageInput.addEventListener('change', (e) => {
//             const file = e.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
//                     imagePreview.classList.add('has-image');
//                 };
//                 reader.readAsDataURL(file);
//             }
//         });

//         imagePreview.addEventListener('click', () => {
//             imageInput.click();
//         });
//     }

//     switchSection(section) {
//         // Update active nav item
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         document.querySelector(`[data-section="${section}"]`).classList.add('active');

//         // Hide all sections
//         document.querySelectorAll('.section').forEach(sec => {
//             sec.classList.remove('active');
//         });

//         // Show active section
//         document.getElementById(`${section}Section`).classList.add('active');

//         // Update page title
//         const titles = {
//             'menu': 'Menu Management',
//             'categories': 'Categories',
//             'analytics': 'Analytics',
//             'database': 'Database Information'
//         };

//         const descriptions = {
//             'menu': 'Manage your restaurant menu items',
//             'categories': 'View menu categories and distribution',
//             'analytics': 'Track your restaurant performance and sales',
//             'database': 'View and manage your restaurant database'
//         };

//         document.getElementById('pageTitle').textContent = titles[section] || 'Restaurant Management';
//         document.getElementById('pageDescription').textContent = descriptions[section] || '';

//         // Load section-specific data
//         if (section === 'database') {
//             this.loadDatabaseInfo();
//         } else if (section === 'analytics') {
//             this.loadAnalytics();
//         } else if (section === 'categories') {
//             this.loadCategories();
//         }
//     }

//     // ==================== ANALYTICS METHODS ====================
//     async loadAnalytics() {
//         try {
//             this.showLoading(true);

//             const [overviewResponse, salesResponse, performanceResponse] = await Promise.all([
//                 fetch('/api/analytics/overview'),
//                 fetch('/api/analytics/sales-data'),
//                 fetch('/api/analytics/performance')
//             ]);

//             if (!overviewResponse.ok || !salesResponse.ok || !performanceResponse.ok) {
//                 throw new Error('Failed to load analytics data');
//             }

//             const overview = await overviewResponse.json();
//             const salesData = await salesResponse.json();
//             const performance = await performanceResponse.json();

//             this.renderAnalyticsOverview(overview);
//             this.renderPerformanceMetrics(performance);
//             this.renderCharts(salesData, overview, performance);

//         } catch (error) {
//             this.showError('Failed to load analytics data');
//             console.error('Error loading analytics:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     renderAnalyticsOverview(overview) {
//         const container = document.getElementById('analyticsOverview');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_items || 0}</div>
//                 <div class="label">Total Menu Items</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.available_items || 0}</div>
//                 <div class="label">Available Items</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_sales || 0}</div>
//                 <div class="label">Total Orders</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_categories || 0}</div>
//                 <div class="label">Categories</div>
//             </div>
//         `;
//     }

//     renderPerformanceMetrics(performance) {
//         const container = document.getElementById('topItems');
//         if (!container) return;

//         if (!performance.popular_items || performance.popular_items.length === 0) {
//             container.innerHTML = `
//                 <div class="no-data">
//                     <i class="fas fa-chart-line"></i>
//                     <p>No sales data yet</p>
//                     <small>Start recording orders to see analytics</small>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = performance.popular_items.map((item, index) => `
//             <div class="top-item">
//                 <div class="item-info">
//                     <span class="rank">${index + 1}</span>
//                     <span class="name">${this.escapeHtml(item.name)}</span>
//                 </div>
//                 <div class="item-stats">
//                     <span class="sales">${item.sales || 0} orders</span>
//                     <span class="revenue">$${(item.revenue || 0).toFixed(2)}</span>
//                 </div>
//             </div>
//         `).join('');
//     }

//     renderCharts(salesData, overview, performance) {
//         this.renderSalesChart(salesData);
//         this.renderCategoryChart(overview);
//         this.renderPerformanceChart(performance);
//     }

//     renderSalesChart(salesData) {
//         const ctx = document.getElementById('salesChart');
//         if (!ctx) return;

//         // Destroy existing chart if it exists
//         if (this.salesChart) {
//             this.salesChart.destroy();
//         }

//         // Handle empty data
//         if (!salesData || salesData.length === 0) {
//             salesData = [{ date: new Date().toISOString(), sales: 0, revenue: 0 }];
//         }

//         const dates = salesData.map(d => {
//             const date = new Date(d.date);
//             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         });

//         const sales = salesData.map(d => d.sales || 0);
//         const revenue = salesData.map(d => d.revenue || 0);

//         this.salesChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: dates,
//                 datasets: [
//                     {
//                         label: 'Daily Orders',
//                         data: sales,
//                         borderColor: '#3498db',
//                         backgroundColor: 'rgba(52, 152, 219, 0.1)',
//                         tension: 0.4,
//                         fill: true
//                     },
//                     {
//                         label: 'Daily Revenue ($)',
//                         data: revenue,
//                         borderColor: '#2ecc71',
//                         backgroundColor: 'rgba(46, 204, 113, 0.1)',
//                         tension: 0.4,
//                         fill: true,
//                         yAxisID: 'y1'
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         title: {
//                             display: true,
//                             text: 'Number of Orders'
//                         }
//                     },
//                     y1: {
//                         beginAtZero: true,
//                         position: 'right',
//                         title: {
//                             display: true,
//                             text: 'Revenue ($)'
//                         },
//                         grid: {
//                             drawOnChartArea: false
//                         }
//                     }
//                 },
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Sales Trend - Last 30 Days'
//                     }
//                 }
//             }
//         });
//     }

//     renderCategoryChart(overview) {
//         const ctx = document.getElementById('categoryChart');
//         if (!ctx) return;

//         // Destroy existing chart if it exists
//         if (this.categoryChart) {
//             this.categoryChart.destroy();
//         }

//         const categories = overview.categories || [];
//         const labels = categories.map(c => c.name);
//         const data = categories.map(c => c.item_count || 0);

//         // Generate colors
//         const backgroundColors = [
//             '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
//             '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
//         ];

//         this.categoryChart = new Chart(ctx, {
//             type: 'doughnut',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: data,
//                     backgroundColor: backgroundColors,
//                     borderWidth: 2,
//                     borderColor: '#fff'
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'right',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Items by Category'
//                     },
//                     tooltip: {
//                         callbacks: {
//                             label: function (context) {
//                                 const label = context.label || '';
//                                 const value = context.raw || 0;
//                                 const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                                 const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
//                                 return `${label}: ${value} items (${percentage}%)`;
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//     }

//     renderPerformanceChart(performance) {
//         const ctx = document.getElementById('performanceChart');
//         if (!ctx) return;

//         if (!performance.metrics) return;

//         // Destroy existing chart if it exists
//         if (this.performanceChart) {
//             this.performanceChart.destroy();
//         }

//         const metrics = performance.metrics;

//         this.performanceChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: ['Total Revenue', 'Avg Order Value', 'Availability Rate'],
//                 datasets: [{
//                     label: 'Performance Metrics',
//                     data: [
//                         (metrics.total_revenue || 0) / 100, // Scale down for better visualization
//                         metrics.avg_order_value || 0,
//                         metrics.available_rate || 0
//                     ],
//                     backgroundColor: [
//                         'rgba(52, 152, 219, 0.8)',
//                         'rgba(46, 204, 113, 0.8)',
//                         'rgba(243, 156, 18, 0.8)'
//                     ],
//                     borderColor: [
//                         '#3498db',
//                         '#2ecc71',
//                         '#f39c12'
//                     ],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 },
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Key Performance Indicators'
//                     },
//                     tooltip: {
//                         callbacks: {
//                             label: function (context) {
//                                 const label = context.dataset.label || '';
//                                 const value = context.raw;
//                                 const index = context.dataIndex;

//                                 if (index === 0) return `Total Revenue: $${(value * 100).toFixed(2)}`;
//                                 if (index === 1) return `Avg Order: $${value.toFixed(2)}`;
//                                 if (index === 2) return `Available: ${value}%`;
//                                 return `${label}: ${value}`;
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//     }
//     // ==================== END ANALYTICS METHODS ====================

//     // ==================== CATEGORIES METHODS ====================
//     async loadCategories() {
//         try {
//             const response = await fetch('/api/categories/stats');
//             if (!response.ok) throw new Error('Failed to load categories');

//             const categories = await response.json();
//             this.renderCategories(categories);
//         } catch (error) {
//             this.showError('Failed to load categories');
//             console.error('Error loading categories:', error);
//         }
//     }

//     renderCategories(categories) {
//         const container = document.getElementById('categoriesGrid');
//         if (!container) return;

//         if (categories.length === 0) {
//             container.innerHTML = `
//                 <div class="no-categories">
//                     <i class="fas fa-tags" style="font-size: 4rem; margin-bottom: 20px; color: var(--gray);"></i>
//                     <h3>No Categories Found</h3>
//                     <p>Add menu items to see categories here</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = categories.map(cat => `
//             <div class="category-card">
//                 <div class="category-header">
//                     <h3>${this.escapeHtml(cat.name)}</h3>
//                     <span class="category-badge">${cat.item_count} items</span>
//                 </div>

//                 <div class="category-stats">
//                     <div class="stat">
//                         <div class="number">${cat.item_count}</div>
//                         <div class="label">Total Items</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.available_items}</div>
//                         <div class="label">Available</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.total_sales}</div>
//                         <div class="label">Total Sales</div>
//                     </div>
//                 </div>

//                 <div class="category-details">
//                     <div class="detail-item">
//                         <i class="fas fa-dollar-sign"></i>
//                         <span>Average Price: $${cat.avg_price ? cat.avg_price.toFixed(2) : '0.00'}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-chart-line"></i>
//                         <span>Sales Performance: ${this.getSalesPerformance(cat.total_sales)}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-percentage"></i>
//                         <span>Availability: ${cat.item_count > 0 ? Math.round((cat.available_items / cat.item_count) * 100) : 0}%</span>
//                     </div>
//                 </div>

//                 <div class="category-actions">
//                     <button class="btn btn-sm btn-primary" onclick="app.filterByCategory('${cat.name}')">
//                         <i class="fas fa-eye"></i> View Items
//                     </button>
//                     <button class="btn btn-sm btn-secondary" onclick="app.viewCategoryAnalytics('${cat.name}')">
//                         <i class="fas fa-chart-bar"></i> Analytics
//                     </button>
//                 </div>
//             </div>
//         `).join('');
//     }

//     getSalesPerformance(sales) {
//         if (sales === 0) return 'No sales';
//         if (sales < 10) return 'Low';
//         if (sales < 50) return 'Medium';
//         if (sales < 100) return 'High';
//         return 'Excellent';
//     }

//     filterByCategory(category) {
//         // Switch to menu section and filter by category
//         this.switchSection('menu');
//         document.getElementById('categoryFilter').value = category;
//         this.filterItems();

//         this.showMessage(`Showing items in: ${category}`, 'success');
//     }

//     viewCategoryAnalytics(category) {
//         this.switchSection('analytics');
//         this.showMessage(`Viewing analytics for: ${category}`, 'success');
//     }
//     // ==================== END CATEGORIES METHODS ====================

//     // ... rest of your existing methods (loadDatabaseInfo, renderDatabaseInfo, renderDatabaseItems, loadItems, etc.) ...

//     // Update the existing loadAnalytics placeholder method
//     async loadAnalyticsOld() {
//         // This is now replaced by the new loadAnalytics method above
//         console.log('Loading analytics...');
//     }
// }

// // Global functions for HTML onclick events
// function openModal() {
//     app.openModal();
// }

// function closeModal() {
//     app.closeModal();
// }

// // Initialize the app when the page loads
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     app = new RestaurantManagementSystem();
// });

// // Close modal when clicking outside
// window.onclick = function (event) {
//     const modal = document.getElementById('itemModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// }



// console.log("🚀 Restaurant Management System Loading...");

// class RestaurantManagementSystem {
//     constructor() {
//         this.items = [];
//         this.categories = [];
//         this.currentEditingId = null;
//         this.salesChart = null;
//         this.categoryChart = null;
//         this.performanceChart = null;
//         this.init();
//     }

//     init() {
//         console.log("🔄 Initializing Restaurant Management System...");
//         this.loadItems();
//         this.loadCategories();
//         this.setupEventListeners();
//         this.setupImageUpload();
//     }

//     setupEventListeners() {
//         console.log("🔧 Setting up event listeners...");

//         // Form submission
//         const itemForm = document.getElementById('itemForm');
//         if (itemForm) {
//             itemForm.addEventListener('submit', (e) => {
//                 e.preventDefault();
//                 this.saveItem();
//             });
//         }

//         // Search and filters
//         const searchInput = document.getElementById('searchInput');
//         if (searchInput) {
//             searchInput.addEventListener('input', (e) => {
//                 this.filterItems();
//             });
//         }

//         const categoryFilter = document.getElementById('categoryFilter');
//         if (categoryFilter) {
//             categoryFilter.addEventListener('change', (e) => {
//                 this.filterItems();
//             });
//         }

//         const availabilityFilter = document.getElementById('availabilityFilter');
//         if (availabilityFilter) {
//             availabilityFilter.addEventListener('change', (e) => {
//                 this.filterItems();
//             });
//         }

//         // Navigation
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.switchSection(item.dataset.section);
//             });
//         });
//     }

//     setupImageUpload() {
//         const imageInput = document.getElementById('image');
//         const imagePreview = document.getElementById('imagePreview');

//         if (imageInput && imagePreview) {
//             imageInput.addEventListener('change', (e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                     const reader = new FileReader();
//                     reader.onload = (e) => {
//                         imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
//                         imagePreview.classList.add('has-image');
//                     };
//                     reader.readAsDataURL(file);
//                 }
//             });

//             imagePreview.addEventListener('click', () => {
//                 imageInput.click();
//             });
//         }
//     }

//     switchSection(section) {
//         console.log(`🔄 Switching to section: ${section}`);

//         // Update active nav item
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         document.querySelector(`[data-section="${section}"]`).classList.add('active');

//         // Hide all sections
//         document.querySelectorAll('.section').forEach(sec => {
//             sec.classList.remove('active');
//         });

//         // Show active section
//         const activeSection = document.getElementById(`${section}Section`);
//         if (activeSection) {
//             activeSection.classList.add('active');
//         }

//         // Update page title
//         const titles = {
//             'menu': 'Menu Management',
//             'categories': 'Categories',
//             'analytics': 'Analytics',
//             'database': 'Database Information'
//         };

//         const descriptions = {
//             'menu': 'Manage your restaurant menu items',
//             'categories': 'View menu categories and distribution',
//             'analytics': 'Track your restaurant performance and sales',
//             'database': 'View and manage your restaurant database'
//         };

//         const pageTitle = document.getElementById('pageTitle');
//         const pageDescription = document.getElementById('pageDescription');

//         if (pageTitle) pageTitle.textContent = titles[section] || 'Restaurant Management';
//         if (pageDescription) pageDescription.textContent = descriptions[section] || '';

//         // Load section-specific data
//         if (section === 'database') {
//             this.loadDatabaseInfo();
//         } else if (section === 'analytics') {
//             this.loadAnalytics();
//         } else if (section === 'categories') {
//             this.loadCategories();
//         }
//     }

//     // ==================== LOAD ITEMS ====================
//     async loadItems() {
//         try {
//             console.log("📥 Loading items from server...");
//             const response = await fetch('/api/items');
//             if (!response.ok) throw new Error('Failed to load items');

//             this.items = await response.json();
//             console.log(`✅ Loaded ${this.items.length} items`);
//             this.renderItems();
//             this.updateStatistics();
//         } catch (error) {
//             console.error('❌ Error loading items:', error);
//             this.showError('Failed to load menu items');
//         }
//     }

//     renderItems() {
//         const container = document.getElementById('menuItems');
//         if (!container) {
//             console.log("❌ menuItems container not found");
//             return;
//         }

//         const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//         const categoryFilter = document.getElementById('categoryFilter').value;
//         const availabilityFilter = document.getElementById('availabilityFilter').value;

//         let filteredItems = this.items.filter(item => {
//             const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
//                 item.description.toLowerCase().includes(searchTerm);
//             const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
//             const matchesAvailability = availabilityFilter === 'all' ||
//                 (availabilityFilter === 'available' && item.is_available) ||
//                 (availabilityFilter === 'unavailable' && !item.is_available);

//             return matchesSearch && matchesCategory && matchesAvailability;
//         });

//         if (filteredItems.length === 0) {
//             container.innerHTML = `
//                 <div class="no-items">
//                     <i class="fas fa-utensils"></i>
//                     <h3>No menu items found</h3>
//                     <p>Try adjusting your search or filters</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = filteredItems.map(item => `
//             <div class="menu-item ${!item.is_available ? 'unavailable' : ''}" data-id="${item.id}">
//                 <div class="item-image">
//                     ${item.image_url ?
//                 `<img src="${item.image_url}" alt="${this.escapeHtml(item.name)}">` :
//                 `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
//             }
//                 </div>
//                 <div class="item-info">
//                     <div class="item-header">
//                         <h3>${this.escapeHtml(item.name)}</h3>
//                         <div class="item-price">$${item.price.toFixed(2)}</div>
//                     </div>
//                     <div class="item-category">${this.escapeHtml(item.category)}</div>
//                     ${item.description ? `<div class="item-description">${this.escapeHtml(item.description)}</div>` : ''}
//                     <div class="item-actions">
//                         <button class="btn btn-edit btn-sm" onclick="app.editItem(${item.id})">
//                             <i class="fas fa-edit"></i> Edit
//                         </button>
//                         <button class="btn btn-delete btn-sm" onclick="app.deleteItem(${item.id})">
//                             <i class="fas fa-trash"></i> Delete
//                         </button>
//                         <button class="btn ${item.is_available ? 'btn-secondary' : 'btn-primary'} btn-sm" 
//                                 onclick="app.toggleAvailability(${item.id})">
//                             <i class="fas ${item.is_available ? 'fa-eye-slash' : 'fa-eye'}"></i>
//                             ${item.is_available ? 'Hide' : 'Show'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');

//         console.log(`✅ Rendered ${filteredItems.length} items`);
//     }

//     filterItems() {
//         this.renderItems();
//     }

//     updateStatistics() {
//         const totalItems = this.items.length;
//         const availableItems = this.items.filter(item => item.is_available).length;
//         const unavailableItems = totalItems - availableItems;
//         const totalCategories = new Set(this.items.map(item => item.category)).size;

//         const totalItemsEl = document.getElementById('totalItems');
//         const availableItemsEl = document.getElementById('availableItems');
//         const unavailableItemsEl = document.getElementById('unavailableItems');
//         const totalCategoriesEl = document.getElementById('totalCategories');

//         if (totalItemsEl) totalItemsEl.textContent = totalItems;
//         if (availableItemsEl) availableItemsEl.textContent = availableItems;
//         if (unavailableItemsEl) unavailableItemsEl.textContent = unavailableItems;
//         if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;
//     }

//     // ==================== CATEGORIES ====================
//     async loadCategories() {
//         try {
//             console.log("📥 Loading categories...");
//             const response = await fetch('/api/categories/stats');
//             if (!response.ok) throw new Error('Failed to load categories');

//             const categories = await response.json();
//             console.log(`✅ Loaded ${categories.length} categories`);
//             this.renderCategories(categories);
//         } catch (error) {
//             console.error('❌ Error loading categories:', error);
//             this.showError('Failed to load categories');
//         }
//     }

//     renderCategories(categories) {
//         const container = document.getElementById('categoriesGrid');
//         if (!container) {
//             console.log("❌ categoriesGrid container not found");
//             return;
//         }

//         if (categories.length === 0) {
//             container.innerHTML = `
//                 <div class="no-categories">
//                     <i class="fas fa-tags"></i>
//                     <h3>No Categories Found</h3>
//                     <p>Add menu items to see categories here</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = categories.map(cat => `
//             <div class="category-card">
//                 <div class="category-header">
//                     <h3>${this.escapeHtml(cat.name)}</h3>
//                     <span class="category-badge">${cat.item_count} items</span>
//                 </div>

//                 <div class="category-stats">
//                     <div class="stat">
//                         <div class="number">${cat.item_count}</div>
//                         <div class="label">Total Items</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.available_items}</div>
//                         <div class="label">Available</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.total_sales}</div>
//                         <div class="label">Total Sales</div>
//                     </div>
//                 </div>

//                 <div class="category-details">
//                     <div class="detail-item">
//                         <i class="fas fa-dollar-sign"></i>
//                         <span>Average Price: $${cat.avg_price.toFixed(2)}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-chart-line"></i>
//                         <span>Sales Performance: ${this.getSalesPerformance(cat.total_sales)}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-percentage"></i>
//                         <span>Availability: ${Math.round((cat.available_items / cat.item_count) * 100)}%</span>
//                     </div>
//                 </div>

//                 <div class="category-actions">
//                     <button class="btn btn-sm btn-primary" onclick="app.filterByCategory('${cat.name}')">
//                         <i class="fas fa-eye"></i> View Items
//                     </button>
//                 </div>
//             </div>
//         `).join('');

//         console.log(`✅ Rendered ${categories.length} categories`);
//     }

//     getSalesPerformance(sales) {
//         if (sales === 0) return 'No sales';
//         if (sales < 10) return 'Low';
//         if (sales < 50) return 'Medium';
//         if (sales < 100) return 'High';
//         return 'Excellent';
//     }

//     filterByCategory(category) {
//         this.switchSection('menu');
//         document.getElementById('categoryFilter').value = category;
//         this.filterItems();
//         this.showMessage(`Showing items in: ${category}`, 'success');
//     }

//     // ==================== ANALYTICS ====================
//     async loadAnalytics() {
//         try {
//             console.log("📥 Loading analytics...");
//             this.showLoading(true);

//             const [overviewResponse, salesResponse, performanceResponse] = await Promise.all([
//                 fetch('/api/analytics/overview'),
//                 fetch('/api/analytics/sales-data'),
//                 fetch('/api/analytics/performance')
//             ]);

//             if (!overviewResponse.ok || !salesResponse.ok || !performanceResponse.ok) {
//                 throw new Error('Failed to load analytics data');
//             }

//             const overview = await overviewResponse.json();
//             const salesData = await salesResponse.json();
//             const performance = await performanceResponse.json();

//             console.log("✅ Analytics data loaded");
//             this.renderAnalyticsOverview(overview);
//             this.renderPerformanceMetrics(performance);
//             this.renderCharts(salesData, overview, performance);

//         } catch (error) {
//             console.error('❌ Error loading analytics:', error);
//             this.showError('Failed to load analytics data');
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     renderAnalyticsOverview(overview) {
//         const container = document.getElementById('analyticsOverview');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_items || 0}</div>
//                 <div class="label">Total Items</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.available_items || 0}</div>
//                 <div class="label">Available</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_sales || 0}</div>
//                 <div class="label">Total Sales</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_categories || 0}</div>
//                 <div class="label">Categories</div>
//             </div>
//         `;
//     }

//     renderPerformanceMetrics(performance) {
//         const container = document.getElementById('topItems');
//         if (!container) return;

//         if (!performance.popular_items || performance.popular_items.length === 0) {
//             container.innerHTML = `
//                 <div class="no-data">
//                     <i class="fas fa-chart-line"></i>
//                     <p>No sales data yet</p>
//                     <small>Start recording orders to see analytics</small>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = performance.popular_items.map((item, index) => `
//             <div class="top-item">
//                 <div class="item-info">
//                     <span class="rank">${index + 1}</span>
//                     <span class="name">${this.escapeHtml(item.name)}</span>
//                 </div>
//                 <div class="item-stats">
//                     <span class="sales">${item.sales} orders</span>
//                     <span class="revenue">$${item.revenue.toFixed(2)}</span>
//                 </div>
//             </div>
//         `).join('');
//     }

//     renderCharts(salesData, overview, performance) {
//         this.renderSalesChart(salesData);
//         this.renderCategoryChart(overview);
//     }

//     renderSalesChart(salesData) {
//         const ctx = document.getElementById('salesChart');
//         if (!ctx) return;

//         if (this.salesChart) {
//             this.salesChart.destroy();
//         }

//         const dates = salesData.map(d => {
//             const date = new Date(d.date);
//             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         });

//         const sales = salesData.map(d => d.sales);

//         this.salesChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: dates,
//                 datasets: [{
//                     label: 'Daily Orders',
//                     data: sales,
//                     borderColor: '#3498db',
//                     backgroundColor: 'rgba(52, 152, 219, 0.1)',
//                     tension: 0.4,
//                     fill: true
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     }

//     renderCategoryChart(overview) {
//         const ctx = document.getElementById('categoryChart');
//         if (!ctx) return;

//         if (this.categoryChart) {
//             this.categoryChart.destroy();
//         }

//         const categories = overview.categories || [];
//         const labels = categories.map(c => c.name);
//         const data = categories.map(c => c.item_count);

//         const backgroundColors = [
//             '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'
//         ];

//         this.categoryChart = new Chart(ctx, {
//             type: 'doughnut',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: data,
//                     backgroundColor: backgroundColors,
//                     borderWidth: 2
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     }

//     // ==================== DATABASE INFO ====================
//     async loadDatabaseInfo() {
//         try {
//             console.log("📥 Loading database info...");
//             const [dbInfoResponse, dbItemsResponse] = await Promise.all([
//                 fetch('/api/database/info'),
//                 fetch('/api/database/items')
//             ]);

//             if (!dbInfoResponse.ok || !dbItemsResponse.ok) {
//                 throw new Error('Failed to load database info');
//             }

//             const dbInfo = await dbInfoResponse.json();
//             const dbItems = await dbItemsResponse.json();

//             this.renderDatabaseInfo(dbInfo);
//             this.renderDatabaseItems(dbItems);
//         } catch (error) {
//             console.error('❌ Error loading database info:', error);
//             this.showError('Failed to load database information');
//         }
//     }

//     renderDatabaseInfo(dbInfo) {
//         const container = document.getElementById('databaseStats');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="db-stat">
//                 <span class="label">Total Items:</span>
//                 <span class="value">${dbInfo.total_items}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Categories:</span>
//                 <span class="value">${dbInfo.categories_count}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Database Size:</span>
//                 <span class="value">${dbInfo.db_size_mb} MB</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Last Updated:</span>
//                 <span class="value">${new Date().toLocaleString()}</span>
//             </div>
//         `;
//     }

//     renderDatabaseItems(items) {
//         const tableBody = document.querySelector('#databaseTable tbody');
//         if (!tableBody) return;

//         if (items.length === 0) {
//             tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">
//                         <i class="fas fa-database"></i>
//                         <h3>No items in database</h3>
//                         <p>Add your first menu item to see it here!</p>
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         tableBody.innerHTML = items.map(item => `
//             <tr>
//                 <td>${item.id}</td>
//                 <td><strong>${this.escapeHtml(item.name)}</strong></td>
//                 <td>$${item.price.toFixed(2)}</td>
//                 <td>${this.escapeHtml(item.category)}</td>
//                 <td>${item.sales_count}</td>
//                 <td>
//                     <span class="${item.is_available ? 'status-available' : 'status-unavailable'}">
//                         ${item.is_available ? 'Available' : 'Unavailable'}
//                     </span>
//                 </td>
//                 <td>${item.created_at}</td>
//             </tr>
//         `).join('');
//     }

//     // ==================== ITEM OPERATIONS ====================
//     async saveItem() {
//         const formData = new FormData();
//         const itemId = document.getElementById('itemId').value;

//         formData.append('name', document.getElementById('name').value.trim());
//         formData.append('price', document.getElementById('price').value);
//         formData.append('description', document.getElementById('description').value.trim());
//         formData.append('category', document.getElementById('category').value);
//         formData.append('is_available', document.getElementById('availability').value);

//         const imageFile = document.getElementById('image').files[0];
//         if (imageFile) {
//             formData.append('image', imageFile);
//         }

//         if (!formData.get('name') || !formData.get('price')) {
//             this.showError('Please fill in all required fields');
//             return;
//         }

//         try {
//             this.showLoading(true);

//             let response;
//             if (this.currentEditingId) {
//                 response = await fetch(`/api/items/${this.currentEditingId}`, {
//                     method: 'PUT',
//                     body: formData
//                 });
//             } else {
//                 response = await fetch('/api/items', {
//                     method: 'POST',
//                     body: formData
//                 });
//             }

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.error || 'Failed to save item');
//             }

//             this.showMessage(
//                 this.currentEditingId ? 'Item updated successfully' : 'Item added successfully',
//                 'success'
//             );

//             this.closeModal();
//             await this.refreshData();

//         } catch (error) {
//             this.showError(error.message);
//             console.error('Error saving item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     editItem(itemId) {
//         const item = this.items.find(i => i.id === itemId);
//         if (!item) return;

//         this.currentEditingId = itemId;
//         document.getElementById('modalTitle').textContent = 'Edit Menu Item';
//         document.getElementById('itemId').value = itemId;
//         document.getElementById('name').value = item.name;
//         document.getElementById('price').value = item.price;
//         document.getElementById('description').value = item.description || '';
//         document.getElementById('category').value = item.category;
//         document.getElementById('availability').value = item.is_available.toString();

//         const imagePreview = document.getElementById('imagePreview');
//         if (item.image_url) {
//             imagePreview.innerHTML = `<img src="${item.image_url}" alt="Preview">`;
//             imagePreview.classList.add('has-image');
//         } else {
//             imagePreview.innerHTML = `
//                 <i class="fas fa-cloud-upload-alt"></i>
//                 <p>Click to upload image</p>
//             `;
//             imagePreview.classList.remove('has-image');
//         }

//         this.openModal();
//     }

//     async deleteItem(itemId) {
//         if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
//             return;
//         }

//         try {
//             this.showLoading(true);
//             const response = await fetch(`/api/items/${itemId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) throw new Error('Failed to delete item');

//             this.showMessage('Item deleted successfully', 'success');
//             await this.refreshData();

//         } catch (error) {
//             this.showError('Failed to delete item');
//             console.error('Error deleting item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async toggleAvailability(itemId) {
//         try {
//             const response = await fetch(`/api/items/${itemId}/availability`, {
//                 method: 'PATCH'
//             });

//             if (!response.ok) throw new Error('Failed to update availability');

//             this.showMessage('Availability updated successfully', 'success');
//             await this.refreshData();

//         } catch (error) {
//             this.showError('Failed to update availability');
//             console.error('Error updating availability:', error);
//         }
//     }

//     // ==================== UTILITY METHODS ====================
//     async refreshData() {
//         await this.loadItems();
//         await this.loadCategories();
//         this.renderItems();
//         this.updateStatistics();
//     }

//     openModal() {
//         document.getElementById('itemModal').style.display = 'block';
//     }

//     closeModal() {
//         document.getElementById('itemModal').style.display = 'none';
//         this.resetForm();
//     }

//     resetForm() {
//         document.getElementById('itemForm').reset();
//         document.getElementById('modalTitle').textContent = 'Add New Menu Item';
//         document.getElementById('itemId').value = '';

//         const imagePreview = document.getElementById('imagePreview');
//         imagePreview.innerHTML = `
//             <i class="fas fa-cloud-upload-alt"></i>
//             <p>Click to upload image</p>
//         `;
//         imagePreview.classList.remove('has-image');

//         this.currentEditingId = null;
//     }

//     showLoading(show) {
//         const spinner = document.getElementById('loadingSpinner');
//         if (spinner) {
//             spinner.style.display = show ? 'flex' : 'none';
//         }
//     }

//     showError(message) {
//         this.showMessage(message, 'error');
//     }

//     showMessage(message, type) {
//         // Remove any existing messages
//         const existingMessage = document.querySelector('.message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         const messageDiv = document.createElement('div');
//         messageDiv.className = `message ${type}`;
//         messageDiv.innerHTML = `
//             <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
//             ${message}
//         `;

//         const mainContent = document.querySelector('.main-content');
//         if (mainContent) {
//             mainContent.insertBefore(messageDiv, mainContent.firstChild);

//             // Auto-remove after 5 seconds
//             setTimeout(() => {
//                 if (messageDiv.parentNode) {
//                     messageDiv.remove();
//                 }
//             }, 5000);
//         }
//     }

//     escapeHtml(unsafe) {
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }
// }

// // Global functions
// function openModal() {
//     if (app) app.openModal();
// }

// function closeModal() {
//     if (app) app.closeModal();
// }

// // Initialize the app when the page loads
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     console.log("📄 DOM Content Loaded");
//     app = new RestaurantManagementSystem();
// });

// // Close modal when clicking outside
// window.onclick = function (event) {
//     const modal = document.getElementById('itemModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// };

// console.log("✅ Restaurant Management System Script Loaded");






// console.log("🚀 Restaurant Management System Loading...");

// class RestaurantManagementSystem {
//     constructor() {
//         this.items = [];
//         this.categories = [];
//         this.currentEditingId = null;
//         this.salesChart = null;
//         this.categoryChart = null;
//         this.performanceChart = null;
//         this.init();
//     }

//     async init() {
//         console.log("🔄 Initializing Restaurant Management System...");

//         // تحميل البيانات بشكل متوازي والانتظار حتى اكتمالها
//         await Promise.all([
//             this.loadItems(),
//             this.loadCategories()
//         ]);

//         this.setupEventListeners();
//         this.setupImageUpload();
//         console.log("✅ System initialization completed");
//     }

//     setupEventListeners() {
//         console.log("🔧 Setting up event listeners...");

//         // Form submission
//         const itemForm = document.getElementById('itemForm');
//         if (itemForm) {
//             itemForm.addEventListener('submit', (e) => {
//                 e.preventDefault();
//                 this.saveItem();
//             });
//         }

//         // Search and filters
//         const searchInput = document.getElementById('searchInput');
//         if (searchInput) {
//             searchInput.addEventListener('input', (e) => {
//                 this.filterItems();
//             });
//         }

//         const categoryFilter = document.getElementById('categoryFilter');
//         if (categoryFilter) {
//             categoryFilter.addEventListener('change', (e) => {
//                 this.filterItems();
//             });
//         }

//         const availabilityFilter = document.getElementById('availabilityFilter');
//         if (availabilityFilter) {
//             availabilityFilter.addEventListener('change', (e) => {
//                 this.filterItems();
//             });
//         }

//         // Navigation
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.switchSection(item.dataset.section);
//             });
//         });
//     }

//     setupImageUpload() {
//         const imageInput = document.getElementById('image');
//         const imagePreview = document.getElementById('imagePreview');

//         if (imageInput && imagePreview) {
//             imageInput.addEventListener('change', (e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                     const reader = new FileReader();
//                     reader.onload = (e) => {
//                         imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
//                         imagePreview.classList.add('has-image');
//                     };
//                     reader.readAsDataURL(file);
//                 }
//             });

//             imagePreview.addEventListener('click', () => {
//                 imageInput.click();
//             });
//         }
//     }

//     switchSection(section) {
//         console.log(`🔄 Switching to section: ${section}`);

//         // Update active nav item
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         document.querySelector(`[data-section="${section}"]`).classList.add('active');

//         // Hide all sections
//         document.querySelectorAll('.section').forEach(sec => {
//             sec.classList.remove('active');
//         });

//         // Show active section
//         const activeSection = document.getElementById(`${section}Section`);
//         if (activeSection) {
//             activeSection.classList.add('active');
//         }

//         // Update page title
//         const titles = {
//             'menu': 'Menu Management',
//             'categories': 'Categories',
//             'analytics': 'Analytics',
//             'database': 'Database Information'
//         };

//         const descriptions = {
//             'menu': 'Manage your restaurant menu items',
//             'categories': 'View menu categories and distribution',
//             'analytics': 'Track your restaurant performance and sales',
//             'database': 'View and manage your restaurant database'
//         };

//         const pageTitle = document.getElementById('pageTitle');
//         const pageDescription = document.getElementById('pageDescription');

//         if (pageTitle) pageTitle.textContent = titles[section] || 'Restaurant Management';
//         if (pageDescription) pageDescription.textContent = descriptions[section] || '';

//         // Load section-specific data
//         if (section === 'database') {
//             this.loadDatabaseInfo();
//         } else if (section === 'analytics') {
//             this.loadAnalytics();
//         } else if (section === 'categories') {
//             this.renderCategories(this.categories); // استخدام البيانات المحملة مسبقاً
//         }
//     }

//     // ==================== LOAD ITEMS ====================
//     async loadItems() {
//         try {
//             console.log("📥 Loading items from server...");
//             const response = await fetch('/api/items');
//             if (!response.ok) throw new Error('Failed to load items');

//             this.items = await response.json();
//             console.log(`✅ Loaded ${this.items.length} items`);
//             this.renderItems();
//             this.updateStatistics();
//             return this.items;
//         } catch (error) {
//             console.error('❌ Error loading items:', error);
//             this.showError('Failed to load menu items');
//             return [];
//         }
//     }

//     renderItems() {
//         const container = document.getElementById('menuItems');
//         if (!container) {
//             console.log("❌ menuItems container not found");
//             return;
//         }

//         const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//         const categoryFilter = document.getElementById('categoryFilter').value;
//         const availabilityFilter = document.getElementById('availabilityFilter').value;

//         let filteredItems = this.items.filter(item => {
//             const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
//                 item.description.toLowerCase().includes(searchTerm);
//             const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
//             const matchesAvailability = availabilityFilter === 'all' ||
//                 (availabilityFilter === 'available' && item.is_available) ||
//                 (availabilityFilter === 'unavailable' && !item.is_available);

//             return matchesSearch && matchesCategory && matchesAvailability;
//         });

//         if (filteredItems.length === 0) {
//             container.innerHTML = `
//                 <div class="no-items">
//                     <i class="fas fa-utensils"></i>
//                     <h3>No menu items found</h3>
//                     <p>Try adjusting your search or filters</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = filteredItems.map(item => `
//             <div class="menu-item ${!item.is_available ? 'unavailable' : ''}" data-id="${item.id}">
//                 <div class="item-image">
//                     ${item.image_url ?
//                 `<img src="${item.image_url}" alt="${this.escapeHtml(item.name)}">` :
//                 `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
//             }
//                 </div>
//                 <div class="item-info">
//                     <div class="item-header">
//                         <h3>${this.escapeHtml(item.name)}</h3>
//                         <div class="item-price">$${item.price.toFixed(2)}</div>
//                     </div>
//                     <div class="item-category">${this.escapeHtml(item.category)}</div>
//                     ${item.description ? `<div class="item-description">${this.escapeHtml(item.description)}</div>` : ''}
//                     <div class="item-actions">
//                         <button class="btn btn-edit btn-sm" onclick="app.editItem(${item.id})">
//                             <i class="fas fa-edit"></i> Edit
//                         </button>
//                         <button class="btn btn-delete btn-sm" onclick="app.deleteItem(${item.id})">
//                             <i class="fas fa-trash"></i> Delete
//                         </button>
//                         <button class="btn ${item.is_available ? 'btn-secondary' : 'btn-primary'} btn-sm" 
//                                 onclick="app.toggleAvailability(${item.id})">
//                             <i class="fas ${item.is_available ? 'fa-eye-slash' : 'fa-eye'}"></i>
//                             ${item.is_available ? 'Hide' : 'Show'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');

//         console.log(`✅ Rendered ${filteredItems.length} items`);
//     }

//     filterItems() {
//         this.renderItems();
//     }

//     updateStatistics() {
//         const totalItems = this.items.length;
//         const availableItems = this.items.filter(item => item.is_available).length;
//         const unavailableItems = totalItems - availableItems;
//         const totalCategories = new Set(this.items.map(item => item.category)).size;

//         const totalItemsEl = document.getElementById('totalItems');
//         const availableItemsEl = document.getElementById('availableItems');
//         const unavailableItemsEl = document.getElementById('unavailableItems');
//         const totalCategoriesEl = document.getElementById('totalCategories');

//         if (totalItemsEl) totalItemsEl.textContent = totalItems;
//         if (availableItemsEl) availableItemsEl.textContent = availableItems;
//         if (unavailableItemsEl) unavailableItemsEl.textContent = unavailableItems;
//         if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;
//     }

//     // ==================== CATEGORIES - الدالة المعدلة ====================
//     async loadCategories() {
//         try {
//             console.log("📥 Loading categories from server...");
//             const response = await fetch('/api/categories/stats');

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const categories = await response.json();
//             console.log(`✅ Loaded ${categories.length} categories`);

//             // حفظ البيانات للاستخدام المستقبلي
//             this.categories = categories;

//             // عرض الأصناف مباشرة
//             this.renderCategories(categories);

//             return categories;

//         } catch (error) {
//             console.error('❌ Error loading categories:', error);
//             this.showError('Failed to load categories. Please check the server connection.');
//             return [];
//         }
//     }

//     renderCategories(categories) {
//         const container = document.getElementById('categoriesGrid');
//         if (!container) {
//             console.log("❌ categoriesGrid container not found");
//             return;
//         }

//         // إذا لم يتم تمرير بيانات، استخدم البيانات المحفوظة
//         const categoriesToRender = categories || this.categories || [];

//         if (categoriesToRender.length === 0) {
//             container.innerHTML = `
//                 <div class="no-categories">
//                     <i class="fas fa-tags"></i>
//                     <h3>No Categories Found</h3>
//                     <p>Add menu items to see categories here</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = categoriesToRender.map(cat => `
//             <div class="category-card">
//                 <div class="category-header">
//                     <h3>${this.escapeHtml(cat.name)}</h3>
//                     <span class="category-badge">${cat.item_count} items</span>
//                 </div>

//                 <div class="category-stats">
//                     <div class="stat">
//                         <div class="number">${cat.item_count}</div>
//                         <div class="label">Total Items</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.available_items}</div>
//                         <div class="label">Available</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.total_sales}</div>
//                         <div class="label">Total Sales</div>
//                     </div>
//                 </div>

//                 <div class="category-details">
//                     <div class="detail-item">
//                         <i class="fas fa-dollar-sign"></i>
//                         <span>Average Price: $${cat.avg_price?.toFixed(2) || '0.00'}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-chart-line"></i>
//                         <span>Sales Performance: ${this.getSalesPerformance(cat.total_sales)}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-percentage"></i>
//                         <span>Availability: ${Math.round((cat.available_items / cat.item_count) * 100)}%</span>
//                     </div>
//                 </div>

//                 <div class="category-actions">
//                     <button class="btn btn-sm btn-primary" onclick="app.filterByCategory('${cat.name}')">
//                         <i class="fas fa-eye"></i> View Items
//                     </button>
//                 </div>
//             </div>
//         `).join('');

//         console.log(`✅ Rendered ${categoriesToRender.length} categories`);
//     }

//     getSalesPerformance(sales) {
//         if (sales === 0) return 'No sales';
//         if (sales < 10) return 'Low';
//         if (sales < 50) return 'Medium';
//         if (sales < 100) return 'High';
//         return 'Excellent';
//     }

//     filterByCategory(category) {
//         this.switchSection('menu');
//         document.getElementById('categoryFilter').value = category;
//         this.filterItems();
//         this.showMessage(`Showing items in: ${category}`, 'success');
//     }

//     // ==================== ANALYTICS ====================
//     async loadAnalytics() {
//         try {
//             console.log("📥 Loading analytics...");
//             this.showLoading(true);

//             const [overviewResponse, salesResponse, performanceResponse] = await Promise.all([
//                 fetch('/api/analytics/overview'),
//                 fetch('/api/analytics/sales-data'),
//                 fetch('/api/analytics/performance')
//             ]);

//             if (!overviewResponse.ok || !salesResponse.ok || !performanceResponse.ok) {
//                 throw new Error('Failed to load analytics data');
//             }

//             const overview = await overviewResponse.json();
//             const salesData = await salesResponse.json();
//             const performance = await performanceResponse.json();

//             console.log("✅ Analytics data loaded");
//             this.renderAnalyticsOverview(overview);
//             this.renderPerformanceMetrics(performance);
//             this.renderCharts(salesData, overview, performance);

//         } catch (error) {
//             console.error('❌ Error loading analytics:', error);
//             this.showError('Failed to load analytics data');
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     renderAnalyticsOverview(overview) {
//         const container = document.getElementById('analyticsOverview');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_items || 0}</div>
//                 <div class="label">Total Items</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.available_items || 0}</div>
//                 <div class="label">Available</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_sales || 0}</div>
//                 <div class="label">Total Sales</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_categories || 0}</div>
//                 <div class="label">Categories</div>
//             </div>
//         `;
//     }

//     renderPerformanceMetrics(performance) {
//         const container = document.getElementById('topItems');
//         if (!container) return;

//         if (!performance.popular_items || performance.popular_items.length === 0) {
//             container.innerHTML = `
//                 <div class="no-data">
//                     <i class="fas fa-chart-line"></i>
//                     <p>No sales data yet</p>
//                     <small>Start recording orders to see analytics</small>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = performance.popular_items.map((item, index) => `
//             <div class="top-item">
//                 <div class="item-info">
//                     <span class="rank">${index + 1}</span>
//                     <span class="name">${this.escapeHtml(item.name)}</span>
//                 </div>
//                 <div class="item-stats">
//                     <span class="sales">${item.sales} orders</span>
//                     <span class="revenue">$${item.revenue.toFixed(2)}</span>
//                 </div>
//             </div>
//         `).join('');
//     }

//     renderCharts(salesData, overview, performance) {
//         this.renderSalesChart(salesData);
//         this.renderCategoryChart(overview);
//     }

//     renderSalesChart(salesData) {
//         const ctx = document.getElementById('salesChart');
//         if (!ctx) return;

//         if (this.salesChart) {
//             this.salesChart.destroy();
//         }

//         const dates = salesData.map(d => {
//             const date = new Date(d.date);
//             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         });

//         const sales = salesData.map(d => d.sales);

//         this.salesChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: dates,
//                 datasets: [{
//                     label: 'Daily Orders',
//                     data: sales,
//                     borderColor: '#3498db',
//                     backgroundColor: 'rgba(52, 152, 219, 0.1)',
//                     tension: 0.4,
//                     fill: true
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     }

//     renderCategoryChart(overview) {
//         const ctx = document.getElementById('categoryChart');
//         if (!ctx) return;

//         if (this.categoryChart) {
//             this.categoryChart.destroy();
//         }

//         const categories = overview.categories || [];
//         const labels = categories.map(c => c.name);
//         const data = categories.map(c => c.item_count);

//         const backgroundColors = [
//             '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'
//         ];

//         this.categoryChart = new Chart(ctx, {
//             type: 'doughnut',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: data,
//                     backgroundColor: backgroundColors,
//                     borderWidth: 2
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     }

//     // ==================== DATABASE INFO ====================
//     async loadDatabaseInfo() {
//         try {
//             console.log("📥 Loading database info...");
//             const [dbInfoResponse, dbItemsResponse] = await Promise.all([
//                 fetch('/api/database/info'),
//                 fetch('/api/database/items')
//             ]);

//             if (!dbInfoResponse.ok || !dbItemsResponse.ok) {
//                 throw new Error('Failed to load database info');
//             }

//             const dbInfo = await dbInfoResponse.json();
//             const dbItems = await dbItemsResponse.json();

//             this.renderDatabaseInfo(dbInfo);
//             this.renderDatabaseItems(dbItems);
//         } catch (error) {
//             console.error('❌ Error loading database info:', error);
//             this.showError('Failed to load database information');
//         }
//     }

//     renderDatabaseInfo(dbInfo) {
//         const container = document.getElementById('databaseStats');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="db-stat">
//                 <span class="label">Total Items:</span>
//                 <span class="value">${dbInfo.total_items}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Categories:</span>
//                 <span class="value">${dbInfo.categories_count}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Database Size:</span>
//                 <span class="value">${dbInfo.db_size_mb} MB</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Last Updated:</span>
//                 <span class="value">${new Date().toLocaleString()}</span>
//             </div>
//         `;
//     }

//     renderDatabaseItems(items) {
//         const tableBody = document.querySelector('#databaseTable tbody');
//         if (!tableBody) return;

//         if (items.length === 0) {
//             tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">
//                         <i class="fas fa-database"></i>
//                         <h3>No items in database</h3>
//                         <p>Add your first menu item to see it here!</p>
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         tableBody.innerHTML = items.map(item => `
//             <tr>
//                 <td>${item.id}</td>
//                 <td><strong>${this.escapeHtml(item.name)}</strong></td>
//                 <td>$${item.price.toFixed(2)}</td>
//                 <td>${this.escapeHtml(item.category)}</td>
//                 <td>${item.sales_count}</td>
//                 <td>
//                     <span class="${item.is_available ? 'status-available' : 'status-unavailable'}">
//                         ${item.is_available ? 'Available' : 'Unavailable'}
//                     </span>
//                 </td>
//                 <td>${item.created_at}</td>
//             </tr>
//         `).join('');
//     }

//     // ==================== ITEM OPERATIONS ====================
//     async saveItem() {
//         const formData = new FormData();
//         const itemId = document.getElementById('itemId').value;

//         formData.append('name', document.getElementById('name').value.trim());
//         formData.append('price', document.getElementById('price').value);
//         formData.append('description', document.getElementById('description').value.trim());
//         formData.append('category', document.getElementById('category').value);
//         formData.append('is_available', document.getElementById('availability').value);

//         const imageFile = document.getElementById('image').files[0];
//         if (imageFile) {
//             formData.append('image', imageFile);
//         }

//         if (!formData.get('name') || !formData.get('price')) {
//             this.showError('Please fill in all required fields');
//             return;
//         }

//         try {
//             this.showLoading(true);

//             let response;
//             if (this.currentEditingId) {
//                 response = await fetch(`/api/items/${this.currentEditingId}`, {
//                     method: 'PUT',
//                     body: formData
//                 });
//             } else {
//                 response = await fetch('/api/items', {
//                     method: 'POST',
//                     body: formData
//                 });
//             }

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.error || 'Failed to save item');
//             }

//             this.showMessage(
//                 this.currentEditingId ? 'Item updated successfully' : 'Item added successfully',
//                 'success'
//             );

//             this.closeModal();
//             await this.refreshData();

//         } catch (error) {
//             this.showError(error.message);
//             console.error('Error saving item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     editItem(itemId) {
//         const item = this.items.find(i => i.id === itemId);
//         if (!item) return;

//         this.currentEditingId = itemId;
//         document.getElementById('modalTitle').textContent = 'Edit Menu Item';
//         document.getElementById('itemId').value = itemId;
//         document.getElementById('name').value = item.name;
//         document.getElementById('price').value = item.price;
//         document.getElementById('description').value = item.description || '';
//         document.getElementById('category').value = item.category;
//         document.getElementById('availability').value = item.is_available.toString();

//         const imagePreview = document.getElementById('imagePreview');
//         if (item.image_url) {
//             imagePreview.innerHTML = `<img src="${item.image_url}" alt="Preview">`;
//             imagePreview.classList.add('has-image');
//         } else {
//             imagePreview.innerHTML = `
//                 <i class="fas fa-cloud-upload-alt"></i>
//                 <p>Click to upload image</p>
//             `;
//             imagePreview.classList.remove('has-image');
//         }

//         this.openModal();
//     }

//     async deleteItem(itemId) {
//         if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
//             return;
//         }

//         try {
//             this.showLoading(true);
//             const response = await fetch(`/api/items/${itemId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) throw new Error('Failed to delete item');

//             this.showMessage('Item deleted successfully', 'success');
//             await this.refreshData();

//         } catch (error) {
//             this.showError('Failed to delete item');
//             console.error('Error deleting item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async toggleAvailability(itemId) {
//         try {
//             const response = await fetch(`/api/items/${itemId}/availability`, {
//                 method: 'PATCH'
//             });

//             if (!response.ok) throw new Error('Failed to update availability');

//             this.showMessage('Availability updated successfully', 'success');
//             await this.refreshData();

//         } catch (error) {
//             this.showError('Failed to update availability');
//             console.error('Error updating availability:', error);
//         }
//     }

//     // ==================== UTILITY METHODS ====================
//     async refreshData() {
//         await Promise.all([
//             this.loadItems(),
//             this.loadCategories()
//         ]);
//         this.renderItems();
//         this.updateStatistics();
//     }

//     openModal() {
//         document.getElementById('itemModal').style.display = 'block';
//     }

//     closeModal() {
//         document.getElementById('itemModal').style.display = 'none';
//         this.resetForm();
//     }

//     resetForm() {
//         document.getElementById('itemForm').reset();
//         document.getElementById('modalTitle').textContent = 'Add New Menu Item';
//         document.getElementById('itemId').value = '';

//         const imagePreview = document.getElementById('imagePreview');
//         imagePreview.innerHTML = `
//             <i class="fas fa-cloud-upload-alt"></i>
//             <p>Click to upload image</p>
//         `;
//         imagePreview.classList.remove('has-image');

//         this.currentEditingId = null;
//     }

//     showLoading(show) {
//         const spinner = document.getElementById('loadingSpinner');
//         if (spinner) {
//             spinner.style.display = show ? 'flex' : 'none';
//         }
//     }

//     showError(message) {
//         this.showMessage(message, 'error');
//     }

//     showMessage(message, type) {
//         // Remove any existing messages
//         const existingMessage = document.querySelector('.message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         const messageDiv = document.createElement('div');
//         messageDiv.className = `message ${type}`;
//         messageDiv.innerHTML = `
//             <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
//             ${message}
//         `;

//         const mainContent = document.querySelector('.main-content');
//         if (mainContent) {
//             mainContent.insertBefore(messageDiv, mainContent.firstChild);

//             // Auto-remove after 5 seconds
//             setTimeout(() => {
//                 if (messageDiv.parentNode) {
//                     messageDiv.remove();
//                 }
//             }, 5000);
//         }
//     }

//     escapeHtml(unsafe) {
//         if (!unsafe) return '';
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }
// }

// // Global functions
// function openModal() {
//     if (app) app.openModal();
// }

// function closeModal() {
//     if (app) app.closeModal();
// }

// // Initialize the app when the page loads
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     console.log("📄 DOM Content Loaded");
//     app = new RestaurantManagementSystem();
// });

// // Close modal when clicking outside
// window.onclick = function (event) {
//     const modal = document.getElementById('itemModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// };

// console.log("✅ Restaurant Management System Script Loaded");








// console.log("🚀 Restaurant Management System Loading...");

// class RestaurantManagementSystem {
//     constructor() {
//         this.items = [];
//         this.categories = [];
//         this.currentEditingId = null;
//         this.salesChart = null;
//         this.categoryChart = null;
//         this.performanceChart = null;
//         this.init();
//     }

//     async init() {
//         console.log("🔄 Initializing Restaurant Management System...");

//         // تحميل البيانات بشكل متوازي والانتظار حتى اكتمالها
//         await Promise.all([
//             this.loadItems(),
//             this.loadCategories()
//         ]);

//         this.setupEventListeners();
//         this.setupImageUpload();
//         console.log("✅ System initialization completed");
//     }

//     setupEventListeners() {
//         console.log("🔧 Setting up event listeners...");

//         // Form submission
//         const itemForm = document.getElementById('itemForm');
//         if (itemForm) {
//             itemForm.addEventListener('submit', (e) => {
//                 e.preventDefault();
//                 this.saveItem();
//             });
//         }

//         // Search and filters
//         const searchInput = document.getElementById('searchInput');
//         if (searchInput) {
//             searchInput.addEventListener('input', (e) => {
//                 this.filterItems();
//             });
//         }

//         const categoryFilter = document.getElementById('categoryFilter');
//         if (categoryFilter) {
//             categoryFilter.addEventListener('change', (e) => {
//                 this.filterItems();
//             });
//         }

//         const availabilityFilter = document.getElementById('availabilityFilter');
//         if (availabilityFilter) {
//             availabilityFilter.addEventListener('change', (e) => {
//                 this.filterItems();
//             });
//         }

//         // Navigation
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.switchSection(item.dataset.section);
//             });
//         });
//     }

//     setupImageUpload() {
//         const imageInput = document.getElementById('image');
//         const imagePreview = document.getElementById('imagePreview');

//         if (imageInput && imagePreview) {
//             imageInput.addEventListener('change', (e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                     const reader = new FileReader();
//                     reader.onload = (e) => {
//                         imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
//                         imagePreview.classList.add('has-image');
//                     };
//                     reader.readAsDataURL(file);
//                 }
//             });

//             imagePreview.addEventListener('click', () => {
//                 imageInput.click();
//             });
//         }
//     }

//     switchSection(section) {
//         console.log(`🔄 Switching to section: ${section}`);

//         // Update active nav item
//         document.querySelectorAll('.nav-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         document.querySelector(`[data-section="${section}"]`).classList.add('active');

//         // Hide all sections
//         document.querySelectorAll('.section').forEach(sec => {
//             sec.classList.remove('active');
//         });

//         // Show active section
//         const activeSection = document.getElementById(`${section}Section`);
//         if (activeSection) {
//             activeSection.classList.add('active');
//         }

//         // Update page title
//         const titles = {
//             'menu': 'Menu Management',
//             'categories': 'Categories',
//             'analytics': 'Analytics',
//             'database': 'Database Information'
//         };

//         const descriptions = {
//             'menu': 'Manage your restaurant menu items',
//             'categories': 'View menu categories and distribution',
//             'analytics': 'Track your restaurant performance and sales',
//             'database': 'View and manage your restaurant database'
//         };

//         const pageTitle = document.getElementById('pageTitle');
//         const pageDescription = document.getElementById('pageDescription');

//         if (pageTitle) pageTitle.textContent = titles[section] || 'Restaurant Management';
//         if (pageDescription) pageDescription.textContent = descriptions[section] || '';

//         // Load section-specific data
//         if (section === 'database') {
//             this.loadDatabaseInfo();
//         } else if (section === 'analytics') {
//             this.loadAnalytics();
//         } else if (section === 'categories') {
//             // ✅ إصلاح: التأكد من أن البيانات محملة ثم العرض
//             if (this.categories && this.categories.length > 0) {
//                 this.renderCategories();
//             } else {
//                 // إذا لم تكن البيانات محملة، إعادة تحميلها
//                 this.loadCategories().then(() => {
//                     this.renderCategories();
//                 });
//             }
//         }
//     }

//     // ==================== LOAD ITEMS ====================
//     async loadItems() {
//         try {
//             console.log("📥 Loading items from server...");
//             const response = await fetch('/api/items');
//             if (!response.ok) throw new Error('Failed to load items');

//             this.items = await response.json();
//             console.log(`✅ Loaded ${this.items.length} items`);
//             this.renderItems();
//             this.updateStatistics();
//             return this.items;
//         } catch (error) {
//             console.error('❌ Error loading items:', error);
//             this.showError('Failed to load menu items');
//             return [];
//         }
//     }

//     renderItems() {
//         const container = document.getElementById('menuItems');
//         if (!container) {
//             console.log("❌ menuItems container not found");
//             return;
//         }

//         const searchTerm = document.getElementById('searchInput').value.toLowerCase();
//         const categoryFilter = document.getElementById('categoryFilter').value;
//         const availabilityFilter = document.getElementById('availabilityFilter').value;

//         let filteredItems = this.items.filter(item => {
//             const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
//                 item.description.toLowerCase().includes(searchTerm);
//             const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
//             const matchesAvailability = availabilityFilter === 'all' ||
//                 (availabilityFilter === 'available' && item.is_available) ||
//                 (availabilityFilter === 'unavailable' && !item.is_available);

//             return matchesSearch && matchesCategory && matchesAvailability;
//         });

//         if (filteredItems.length === 0) {
//             container.innerHTML = `
//                 <div class="no-items">
//                     <i class="fas fa-utensils"></i>
//                     <h3>No menu items found</h3>
//                     <p>Try adjusting your search or filters</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = filteredItems.map(item => `
//             <div class="menu-item ${!item.is_available ? 'unavailable' : ''}" data-id="${item.id}">
//                 <div class="item-image">
//                     ${item.image_url ?
//                 `<img src="${item.image_url}" alt="${this.escapeHtml(item.name)}">` :
//                 `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
//             }
//                 </div>
//                 <div class="item-info">
//                     <div class="item-header">
//                         <h3>${this.escapeHtml(item.name)}</h3>
//                         <div class="item-price">$${item.price.toFixed(2)}</div>
//                     </div>
//                     <div class="item-category">${this.escapeHtml(item.category)}</div>
//                     ${item.description ? `<div class="item-description">${this.escapeHtml(item.description)}</div>` : ''}
//                     <div class="item-actions">
//                         <button class="btn btn-edit btn-sm" onclick="app.editItem(${item.id})">
//                             <i class="fas fa-edit"></i> Edit
//                         </button>
//                         <button class="btn btn-delete btn-sm" onclick="app.deleteItem(${item.id})">
//                             <i class="fas fa-trash"></i> Delete
//                         </button>
//                         <button class="btn ${item.is_available ? 'btn-secondary' : 'btn-primary'} btn-sm" 
//                                 onclick="app.toggleAvailability(${item.id})">
//                             <i class="fas ${item.is_available ? 'fa-eye-slash' : 'fa-eye'}"></i>
//                             ${item.is_available ? 'Hide' : 'Show'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');

//         console.log(`✅ Rendered ${filteredItems.length} items`);
//     }

//     filterItems() {
//         this.renderItems();
//     }

//     updateStatistics() {
//         const totalItems = this.items.length;
//         const availableItems = this.items.filter(item => item.is_available).length;
//         const unavailableItems = totalItems - availableItems;
//         const totalCategories = new Set(this.items.map(item => item.category)).size;

//         const totalItemsEl = document.getElementById('totalItems');
//         const availableItemsEl = document.getElementById('availableItems');
//         const unavailableItemsEl = document.getElementById('unavailableItems');
//         const totalCategoriesEl = document.getElementById('totalCategories');

//         if (totalItemsEl) totalItemsEl.textContent = totalItems;
//         if (availableItemsEl) availableItemsEl.textContent = availableItems;
//         if (unavailableItemsEl) unavailableItemsEl.textContent = unavailableItems;
//         if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;
//     }

//     // ==================== CATEGORIES - الدالة المعدلة ====================
//     async loadCategories() {
//         try {
//             console.log("📥 Loading categories from server...");
//             const response = await fetch('/api/categories/stats');

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const categories = await response.json();
//             console.log(`✅ Loaded ${categories.length} categories from server`);

//             // ✅ إضافة "All Categories" كخيار أول
//             const allCategories = {
//                 name: "All Categories",
//                 item_count: this.items.length,
//                 available_items: this.items.filter(item => item.is_available).length,
//                 total_sales: categories.reduce((sum, cat) => sum + (cat.total_sales || 0), 0),
//                 avg_price: this.items.length > 0 ?
//                     this.items.reduce((sum, item) => sum + item.price, 0) / this.items.length : 0
//             };

//             this.categories = [allCategories, ...categories];
//             console.log(`✅ Added All Categories, total: ${this.categories.length}`);

//             return this.categories;

//         } catch (error) {
//             console.error('❌ Error loading categories:', error);
//             this.showError('Failed to load categories. Please check the server connection.');
//             return [];
//         }
//     }

//     renderCategories(categories = null) {
//         const container = document.getElementById('categoriesGrid');
//         if (!container) {
//             console.log("❌ categoriesGrid container not found");
//             return;
//         }

//         // ✅ استخدام البيانات الممررة أو المحفوظة
//         const categoriesToRender = categories || this.categories || [];

//         if (categoriesToRender.length === 0) {
//             container.innerHTML = `
//                 <div class="no-categories">
//                     <i class="fas fa-tags"></i>
//                     <h3>No Categories Found</h3>
//                     <p>Add menu items to see categories here</p>
//                     <button class="btn btn-primary" onclick="openModal()">
//                         <i class="fas fa-plus"></i>
//                         Add Your First Item
//                     </button>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = categoriesToRender.map(cat => `
//             <div class="category-card ${cat.name === 'All Categories' ? 'all-categories' : ''}">
//                 <div class="category-header">
//                     <h3>${this.escapeHtml(cat.name)}</h3>
//                     <span class="category-badge">${cat.item_count} items</span>
//                 </div>

//                 ${cat.name !== 'All Categories' ? `
//                 <div class="category-stats">
//                     <div class="stat">
//                         <div class="number">${cat.item_count}</div>
//                         <div class="label">Total Items</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.available_items}</div>
//                         <div class="label">Available</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.total_sales}</div>
//                         <div class="label">Total Sales</div>
//                     </div>
//                 </div>

//                 <div class="category-details">
//                     <div class="detail-item">
//                         <i class="fas fa-dollar-sign"></i>
//                         <span>Average Price: $${cat.avg_price?.toFixed(2) || '0.00'}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-chart-line"></i>
//                         <span>Sales Performance: ${this.getSalesPerformance(cat.total_sales)}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-percentage"></i>
//                         <span>Availability: ${Math.round((cat.available_items / cat.item_count) * 100)}%</span>
//                     </div>
//                 </div>
//                 ` : `
//                 <div class="category-stats">
//                     <div class="stat">
//                         <div class="number">${cat.item_count}</div>
//                         <div class="label">Total Items</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.available_items}</div>
//                         <div class="label">Available</div>
//                     </div>
//                     <div class="stat">
//                         <div class="number">${cat.total_sales}</div>
//                         <div class="label">Total Sales</div>
//                     </div>
//                 </div>

//                 <div class="category-details">
//                     <div class="detail-item">
//                         <i class="fas fa-dollar-sign"></i>
//                         <span>Average Price: $${cat.avg_price?.toFixed(2) || '0.00'}</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-chart-line"></i>
//                         <span>Includes all menu categories</span>
//                     </div>
//                     <div class="detail-item">
//                         <i class="fas fa-percentage"></i>
//                         <span>Availability: ${Math.round((cat.available_items / cat.item_count) * 100)}%</span>
//                     </div>
//                 </div>
//                 `}

//                 <div class="category-actions">
//                     <button class="btn btn-sm btn-primary" onclick="app.filterByCategory('${cat.name === 'All Categories' ? 'all' : cat.name}')">
//                         <i class="fas fa-eye"></i> 
//                         ${cat.name === 'All Categories' ? 'View All Items' : 'View Items'}
//                     </button>
//                 </div>
//             </div>
//         `).join('');

//         console.log(`✅ Rendered ${categoriesToRender.length} categories`);
//     }

//     getSalesPerformance(sales) {
//         if (sales === 0) return 'No sales';
//         if (sales < 10) return 'Low';
//         if (sales < 50) return 'Medium';
//         if (sales < 100) return 'High';
//         return 'Excellent';
//     }

//     filterByCategory(category) {
//         this.switchSection('menu');
//         document.getElementById('categoryFilter').value = category;
//         this.filterItems();
//         this.showMessage(`Showing items in: ${category === 'all' ? 'All Categories' : category}`, 'success');
//     }

//     // ==================== ANALYTICS ====================
//     async loadAnalytics() {
//         try {
//             console.log("📥 Loading analytics...");
//             this.showLoading(true);

//             const [overviewResponse, salesResponse, performanceResponse] = await Promise.all([
//                 fetch('/api/analytics/overview'),
//                 fetch('/api/analytics/sales-data'),
//                 fetch('/api/analytics/performance')
//             ]);

//             if (!overviewResponse.ok || !salesResponse.ok || !performanceResponse.ok) {
//                 throw new Error('Failed to load analytics data');
//             }

//             const overview = await overviewResponse.json();
//             const salesData = await salesResponse.json();
//             const performance = await performanceResponse.json();

//             console.log("✅ Analytics data loaded");
//             this.renderAnalyticsOverview(overview);
//             this.renderPerformanceMetrics(performance);
//             this.renderCharts(salesData, overview, performance);

//         } catch (error) {
//             console.error('❌ Error loading analytics:', error);
//             this.showError('Failed to load analytics data');
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     renderAnalyticsOverview(overview) {
//         const container = document.getElementById('analyticsOverview');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_items || 0}</div>
//                 <div class="label">Total Items</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.available_items || 0}</div>
//                 <div class="label">Available</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_sales || 0}</div>
//                 <div class="label">Total Sales</div>
//             </div>
//             <div class="analytics-stat">
//                 <div class="number">${overview.overview?.total_categories || 0}</div>
//                 <div class="label">Categories</div>
//             </div>
//         `;
//     }

//     renderPerformanceMetrics(performance) {
//         const container = document.getElementById('topItems');
//         if (!container) return;

//         if (!performance.popular_items || performance.popular_items.length === 0) {
//             container.innerHTML = `
//                 <div class="no-data">
//                     <i class="fas fa-chart-line"></i>
//                     <p>No sales data yet</p>
//                     <small>Start recording orders to see analytics</small>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = performance.popular_items.map((item, index) => `
//             <div class="top-item">
//                 <div class="item-info">
//                     <span class="rank">${index + 1}</span>
//                     <span class="name">${this.escapeHtml(item.name)}</span>
//                 </div>
//                 <div class="item-stats">
//                     <span class="sales">${item.sales} orders</span>
//                     <span class="revenue">$${item.revenue.toFixed(2)}</span>
//                 </div>
//             </div>
//         `).join('');
//     }

//     renderCharts(salesData, overview, performance) {
//         this.renderSalesChart(salesData);
//         this.renderCategoryChart(overview);
//     }

//     renderSalesChart(salesData) {
//         const ctx = document.getElementById('salesChart');
//         if (!ctx) return;

//         if (this.salesChart) {
//             this.salesChart.destroy();
//         }

//         const dates = salesData.map(d => {
//             const date = new Date(d.date);
//             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         });

//         const sales = salesData.map(d => d.sales);

//         this.salesChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: dates,
//                 datasets: [{
//                     label: 'Daily Orders',
//                     data: sales,
//                     borderColor: '#3498db',
//                     backgroundColor: 'rgba(52, 152, 219, 0.1)',
//                     tension: 0.4,
//                     fill: true
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     }

//     renderCategoryChart(overview) {
//         const ctx = document.getElementById('categoryChart');
//         if (!ctx) return;

//         if (this.categoryChart) {
//             this.categoryChart.destroy();
//         }

//         const categories = overview.categories || [];
//         const labels = categories.map(c => c.name);
//         const data = categories.map(c => c.item_count);

//         const backgroundColors = [
//             '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'
//         ];

//         this.categoryChart = new Chart(ctx, {
//             type: 'doughnut',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: data,
//                     backgroundColor: backgroundColors,
//                     borderWidth: 2
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     }

//     // ==================== DATABASE INFO ====================
//     async loadDatabaseInfo() {
//         try {
//             console.log("📥 Loading database info...");
//             const [dbInfoResponse, dbItemsResponse] = await Promise.all([
//                 fetch('/api/database/info'),
//                 fetch('/api/database/items')
//             ]);

//             if (!dbInfoResponse.ok || !dbItemsResponse.ok) {
//                 throw new Error('Failed to load database info');
//             }

//             const dbInfo = await dbInfoResponse.json();
//             const dbItems = await dbItemsResponse.json();

//             this.renderDatabaseInfo(dbInfo);
//             this.renderDatabaseItems(dbItems);
//         } catch (error) {
//             console.error('❌ Error loading database info:', error);
//             this.showError('Failed to load database information');
//         }
//     }

//     renderDatabaseInfo(dbInfo) {
//         const container = document.getElementById('databaseStats');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="db-stat">
//                 <span class="label">Total Items:</span>
//                 <span class="value">${dbInfo.total_items}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Categories:</span>
//                 <span class="value">${dbInfo.categories_count}</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Database Size:</span>
//                 <span class="value">${dbInfo.db_size_mb} MB</span>
//             </div>
//             <div class="db-stat">
//                 <span class="label">Last Updated:</span>
//                 <span class="value">${new Date().toLocaleString()}</span>
//             </div>
//         `;
//     }

//     renderDatabaseItems(items) {
//         const tableBody = document.querySelector('#databaseTable tbody');
//         if (!tableBody) return;

//         if (items.length === 0) {
//             tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">
//                         <i class="fas fa-database"></i>
//                         <h3>No items in database</h3>
//                         <p>Add your first menu item to see it here!</p>
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         tableBody.innerHTML = items.map(item => `
//             <tr>
//                 <td>${item.id}</td>
//                 <td><strong>${this.escapeHtml(item.name)}</strong></td>
//                 <td>$${item.price.toFixed(2)}</td>
//                 <td>${this.escapeHtml(item.category)}</td>
//                 <td>${item.sales_count}</td>
//                 <td>
//                     <span class="${item.is_available ? 'status-available' : 'status-unavailable'}">
//                         ${item.is_available ? 'Available' : 'Unavailable'}
//                     </span>
//                 </td>
//                 <td>${item.created_at}</td>
//             </tr>
//         `).join('');
//     }

//     // ==================== ITEM OPERATIONS ====================
//     async saveItem() {
//         const formData = new FormData();
//         const itemId = document.getElementById('itemId').value;

//         formData.append('name', document.getElementById('name').value.trim());
//         formData.append('price', document.getElementById('price').value);
//         formData.append('description', document.getElementById('description').value.trim());
//         formData.append('category', document.getElementById('category').value);
//         formData.append('is_available', document.getElementById('availability').value);

//         const imageFile = document.getElementById('image').files[0];
//         if (imageFile) {
//             formData.append('image', imageFile);
//         }

//         if (!formData.get('name') || !formData.get('price')) {
//             this.showError('Please fill in all required fields');
//             return;
//         }

//         try {
//             this.showLoading(true);

//             let response;
//             if (this.currentEditingId) {
//                 response = await fetch(`/api/items/${this.currentEditingId}`, {
//                     method: 'PUT',
//                     body: formData
//                 });
//             } else {
//                 response = await fetch('/api/items', {
//                     method: 'POST',
//                     body: formData
//                 });
//             }

//             if (!response.ok) {
//                 const error = await response.json();
//                 throw new Error(error.error || 'Failed to save item');
//             }

//             this.showMessage(
//                 this.currentEditingId ? 'Item updated successfully' : 'Item added successfully',
//                 'success'
//             );

//             this.closeModal();
//             await this.refreshData();

//         } catch (error) {
//             this.showError(error.message);
//             console.error('Error saving item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     editItem(itemId) {
//         const item = this.items.find(i => i.id === itemId);
//         if (!item) return;

//         this.currentEditingId = itemId;
//         document.getElementById('modalTitle').textContent = 'Edit Menu Item';
//         document.getElementById('itemId').value = itemId;
//         document.getElementById('name').value = item.name;
//         document.getElementById('price').value = item.price;
//         document.getElementById('description').value = item.description || '';
//         document.getElementById('category').value = item.category;
//         document.getElementById('availability').value = item.is_available.toString();

//         const imagePreview = document.getElementById('imagePreview');
//         if (item.image_url) {
//             imagePreview.innerHTML = `<img src="${item.image_url}" alt="Preview">`;
//             imagePreview.classList.add('has-image');
//         } else {
//             imagePreview.innerHTML = `
//                 <i class="fas fa-cloud-upload-alt"></i>
//                 <p>Click to upload image</p>
//             `;
//             imagePreview.classList.remove('has-image');
//         }

//         this.openModal();
//     }

//     async deleteItem(itemId) {
//         if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
//             return;
//         }

//         try {
//             this.showLoading(true);
//             const response = await fetch(`/api/items/${itemId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) throw new Error('Failed to delete item');

//             this.showMessage('Item deleted successfully', 'success');
//             await this.refreshData();

//         } catch (error) {
//             this.showError('Failed to delete item');
//             console.error('Error deleting item:', error);
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     async toggleAvailability(itemId) {
//         try {
//             const response = await fetch(`/api/items/${itemId}/availability`, {
//                 method: 'PATCH'
//             });

//             if (!response.ok) throw new Error('Failed to update availability');

//             this.showMessage('Availability updated successfully', 'success');
//             await this.refreshData();

//         } catch (error) {
//             this.showError('Failed to update availability');
//             console.error('Error updating availability:', error);
//         }
//     }

//     // ==================== UTILITY METHODS ====================
//     async refreshData() {
//         await Promise.all([
//             this.loadItems(),
//             this.loadCategories()
//         ]);
//         this.renderItems();
//         this.updateStatistics();
//     }

//     openModal() {
//         document.getElementById('itemModal').style.display = 'block';
//     }

//     closeModal() {
//         document.getElementById('itemModal').style.display = 'none';
//         this.resetForm();
//     }

//     resetForm() {
//         document.getElementById('itemForm').reset();
//         document.getElementById('modalTitle').textContent = 'Add New Menu Item';
//         document.getElementById('itemId').value = '';

//         const imagePreview = document.getElementById('imagePreview');
//         imagePreview.innerHTML = `
//             <i class="fas fa-cloud-upload-alt"></i>
//             <p>Click to upload image</p>
//         `;
//         imagePreview.classList.remove('has-image');

//         this.currentEditingId = null;
//     }

//     showLoading(show) {
//         const spinner = document.getElementById('loadingSpinner');
//         if (spinner) {
//             spinner.style.display = show ? 'flex' : 'none';
//         }
//     }

//     showError(message) {
//         this.showMessage(message, 'error');
//     }

//     showMessage(message, type) {
//         // Remove any existing messages
//         const existingMessage = document.querySelector('.message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         const messageDiv = document.createElement('div');
//         messageDiv.className = `message ${type}`;
//         messageDiv.innerHTML = `
//             <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
//             ${message}
//         `;

//         const mainContent = document.querySelector('.main-content');
//         if (mainContent) {
//             mainContent.insertBefore(messageDiv, mainContent.firstChild);

//             // Auto-remove after 5 seconds
//             setTimeout(() => {
//                 if (messageDiv.parentNode) {
//                     messageDiv.remove();
//                 }
//             }, 5000);
//         }
//     }

//     escapeHtml(unsafe) {
//         if (!unsafe) return '';
//         return unsafe
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             .replace(/"/g, "&quot;")
//             .replace(/'/g, "&#039;");
//     }
// }

// // Global functions
// function openModal() {
//     if (app) app.openModal();
// }

// function closeModal() {
//     if (app) app.closeModal();
// }

// // Initialize the app when the page loads
// let app;
// document.addEventListener('DOMContentLoaded', () => {
//     console.log("📄 DOM Content Loaded");
//     app = new RestaurantManagementSystem();
// });

// // Close modal when clicking outside
// window.onclick = function (event) {
//     const modal = document.getElementById('itemModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// };

// console.log("✅ Restaurant Management System Script Loaded");









console.log("🚀 Restaurant Management System Loading...");

class RestaurantManagementSystem {
    constructor() {
        this.items = [];
        this.categories = [];
        this.currentEditingId = null;
        this.salesChart = null;
        this.categoryChart = null;
        this.performanceChart = null;
        this.init();
    }

    async init() {
        console.log("🔄 Initializing Restaurant Management System...");

        // تحميل البيانات بشكل متوازي والانتظار حتى اكتمالها
        await Promise.all([
            this.loadItems(),
            this.loadCategories(),
            this.loadCategoriesForFilter() // ✅ إضافة تحميل الفئات للفلتر
        ]);

        this.setupEventListeners();
        this.setupImageUpload();
        console.log("✅ System initialization completed");
    }

    setupEventListeners() {
        console.log("🔧 Setting up event listeners...");

        // Form submission
        const itemForm = document.getElementById('itemForm');
        if (itemForm) {
            itemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveItem();
            });
        }

        // Search and filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterItems();
            });
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterItems();
            });
        }

        const availabilityFilter = document.getElementById('availabilityFilter');
        if (availabilityFilter) {
            availabilityFilter.addEventListener('change', (e) => {
                this.filterItems();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });
    }

    setupImageUpload() {
        const imageInput = document.getElementById('image');
        const imagePreview = document.getElementById('imagePreview');

        if (imageInput && imagePreview) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                        imagePreview.classList.add('has-image');
                    };
                    reader.readAsDataURL(file);
                }
            });

            imagePreview.addEventListener('click', () => {
                imageInput.click();
            });
        }
    }

    switchSection(section) {
        console.log(`🔄 Switching to section: ${section}`);

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Hide all sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show active section
        const activeSection = document.getElementById(`${section}Section`);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        // Update page title
        const titles = {
            'menu': 'Menu Management',
            'categories': 'Categories',
            'analytics': 'Analytics',
            'database': 'Database Information'
        };

        const descriptions = {
            'menu': 'Manage your restaurant menu items',
            'categories': 'View menu categories and distribution',
            'analytics': 'Track your restaurant performance and sales',
            'database': 'View and manage your restaurant database'
        };

        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');

        if (pageTitle) pageTitle.textContent = titles[section] || 'Restaurant Management';
        if (pageDescription) pageDescription.textContent = descriptions[section] || '';

        // Load section-specific data
        if (section === 'database') {
            this.loadDatabaseInfo();
        } else if (section === 'analytics') {
            this.loadAnalytics();
        } else if (section === 'categories') {
            // ✅ إصلاح: التأكد من أن البيانات محملة ثم العرض
            if (this.categories && this.categories.length > 0) {
                this.renderCategories();
            } else {
                // إذا لم تكن البيانات محملة، إعادة تحميلها
                this.loadCategories().then(() => {
                    this.renderCategories();
                });
            }
        }
    }

    // ==================== LOAD ITEMS ====================
    async loadItems() {
        try {
            console.log("📥 Loading items from server...");
            const response = await fetch('/api/items');
            if (!response.ok) throw new Error('Failed to load items');

            this.items = await response.json();
            console.log(`✅ Loaded ${this.items.length} items`);
            this.renderItems();
            this.updateStatistics();
            return this.items;
        } catch (error) {
            console.error('❌ Error loading items:', error);
            this.showError('Failed to load menu items');
            return [];
        }
    }

    // ==================== LOAD CATEGORIES FOR FILTER ====================
    async loadCategoriesForFilter() {
        try {
            console.log("📥 Loading categories for filter...");
            const categoryFilter = document.getElementById('categoryFilter');

            if (!categoryFilter) {
                console.log("❌ categoryFilter element not found");
                return;
            }

            // الحصول على الفئات من السيرفر
            const response = await fetch('/api/items/categories');

            if (!response.ok) {
                throw new Error('Failed to load categories');
            }

            const categories = await response.json();

            // مسح الخيارات الحالية (مع الاحتفاظ بـ "All Categories")
            categoryFilter.innerHTML = '<option value="all">All Categories</option>';

            // إضافة الفئات
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });

            console.log(`✅ Loaded ${categories.length} categories to filter`);

        } catch (error) {
            console.error('❌ Error loading categories for filter:', error);
            // استخدام الفئات الافتراضية كبديل
            this.loadDefaultCategories();
        }
    }

    // ✅ دالة للفئات الافتراضية إذا فشل الاتصال
    loadDefaultCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const defaultCategories = [
            'Main Course', 'Salads', 'Desserts', 'Appetizers',
            'Beverages', 'Soups', 'Breakfast', 'Sides'
        ];

        defaultCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        console.log("✅ Loaded default categories to filter");
    }

    renderItems() {
        const container = document.getElementById('menuItems');
        if (!container) {
            console.log("❌ menuItems container not found");
            return;
        }

        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const availabilityFilter = document.getElementById('availabilityFilter').value;

        let filteredItems = this.items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
            const matchesAvailability = availabilityFilter === 'all' ||
                (availabilityFilter === 'available' && item.is_available) ||
                (availabilityFilter === 'unavailable' && !item.is_available);

            return matchesSearch && matchesCategory && matchesAvailability;
        });

        if (filteredItems.length === 0) {
            container.innerHTML = `
                <div class="no-items">
                    <i class="fas fa-utensils"></i>
                    <h3>No menu items found</h3>
                    <p>Try adjusting your search or filters</p>
                    <button class="btn btn-primary" onclick="openModal()">
                        <i class="fas fa-plus"></i>
                        Add Your First Item
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredItems.map(item => `
            <div class="menu-item ${!item.is_available ? 'unavailable' : ''}" data-id="${item.id}">
                <div class="item-image">
                    ${item.image_url ?
                `<img src="${item.image_url}" alt="${this.escapeHtml(item.name)}">` :
                `<div class="placeholder"><i class="fas fa-utensils"></i></div>`
            }
                </div>
                <div class="item-info">
                    <div class="item-header">
                        <h3>${this.escapeHtml(item.name)}</h3>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="item-category">${this.escapeHtml(item.category)}</div>
                    ${item.description ? `<div class="item-description">${this.escapeHtml(item.description)}</div>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-edit btn-sm" onclick="app.editItem(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-delete btn-sm" onclick="app.deleteItem(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button class="btn ${item.is_available ? 'btn-secondary' : 'btn-primary'} btn-sm" 
                                onclick="app.toggleAvailability(${item.id})">
                            <i class="fas ${item.is_available ? 'fa-eye-slash' : 'fa-eye'}"></i>
                            ${item.is_available ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log(`✅ Rendered ${filteredItems.length} items`);
    }

    filterItems() {
        this.renderItems();
    }

    updateStatistics() {
        const totalItems = this.items.length;
        const availableItems = this.items.filter(item => item.is_available).length;
        const unavailableItems = totalItems - availableItems;
        const totalCategories = new Set(this.items.map(item => item.category)).size;

        const totalItemsEl = document.getElementById('totalItems');
        const availableItemsEl = document.getElementById('availableItems');
        const unavailableItemsEl = document.getElementById('unavailableItems');
        const totalCategoriesEl = document.getElementById('totalCategories');

        if (totalItemsEl) totalItemsEl.textContent = totalItems;
        if (availableItemsEl) availableItemsEl.textContent = availableItems;
        if (unavailableItemsEl) unavailableItemsEl.textContent = unavailableItems;
        if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;
    }

    // ==================== CATEGORIES - الدالة المعدلة ====================
    async loadCategories() {
        try {
            console.log("📥 Loading categories from server...");
            const response = await fetch('/api/categories/stats');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const categories = await response.json();
            console.log(`✅ Loaded ${categories.length} categories from server`);

            // ✅ إضافة "All Categories" كخيار أول
            const allCategories = {
                name: "All Categories",
                item_count: this.items.length,
                available_items: this.items.filter(item => item.is_available).length,
                total_sales: categories.reduce((sum, cat) => sum + (cat.total_sales || 0), 0),
                avg_price: this.items.length > 0 ?
                    this.items.reduce((sum, item) => sum + item.price, 0) / this.items.length : 0
            };

            this.categories = [allCategories, ...categories];
            console.log(`✅ Added All Categories, total: ${this.categories.length}`);

            return this.categories;

        } catch (error) {
            console.error('❌ Error loading categories:', error);
            this.showError('Failed to load categories. Please check the server connection.');
            return [];
        }
    }

    renderCategories(categories = null) {
        const container = document.getElementById('categoriesGrid');
        if (!container) {
            console.log("❌ categoriesGrid container not found");
            return;
        }

        // ✅ استخدام البيانات الممررة أو المحفوظة
        const categoriesToRender = categories || this.categories || [];

        if (categoriesToRender.length === 0) {
            container.innerHTML = `
                <div class="no-categories">
                    <i class="fas fa-tags"></i>
                    <h3>No Categories Found</h3>
                    <p>Add menu items to see categories here</p>
                    <button class="btn btn-primary" onclick="openModal()">
                        <i class="fas fa-plus"></i>
                        Add Your First Item
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = categoriesToRender.map(cat => `
            <div class="category-card ${cat.name === 'All Categories' ? 'all-categories' : ''}">
                <div class="category-header">
                    <h3>${this.escapeHtml(cat.name)}</h3>
                    <span class="category-badge">${cat.item_count} items</span>
                </div>
                
                ${cat.name !== 'All Categories' ? `
                <div class="category-stats">
                    <div class="stat">
                        <div class="number">${cat.item_count}</div>
                        <div class="label">Total Items</div>
                    </div>
                    <div class="stat">
                        <div class="number">${cat.available_items}</div>
                        <div class="label">Available</div>
                    </div>
                    <div class="stat">
                        <div class="number">${cat.total_sales}</div>
                        <div class="label">Total Sales</div>
                    </div>
                </div>
                
                <div class="category-details">
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Average Price: $${cat.avg_price?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-chart-line"></i>
                        <span>Sales Performance: ${this.getSalesPerformance(cat.total_sales)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-percentage"></i>
                        <span>Availability: ${Math.round((cat.available_items / cat.item_count) * 100)}%</span>
                    </div>
                </div>
                ` : `
                <div class="category-stats">
                    <div class="stat">
                        <div class="number">${cat.item_count}</div>
                        <div class="label">Total Items</div>
                    </div>
                    <div class="stat">
                        <div class="number">${cat.available_items}</div>
                        <div class="label">Available</div>
                    </div>
                    <div class="stat">
                        <div class="number">${cat.total_sales}</div>
                        <div class="label">Total Sales</div>
                    </div>
                </div>
                
                <div class="category-details">
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Average Price: $${cat.avg_price?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-chart-line"></i>
                        <span>Includes all menu categories</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-percentage"></i>
                        <span>Availability: ${Math.round((cat.available_items / cat.item_count) * 100)}%</span>
                    </div>
                </div>
                `}
                
                <div class="category-actions">
                    <button class="btn btn-sm btn-primary" onclick="app.filterByCategory('${cat.name === 'All Categories' ? 'all' : cat.name}')">
                        <i class="fas fa-eye"></i> 
                        ${cat.name === 'All Categories' ? 'View All Items' : 'View Items'}
                    </button>
                </div>
            </div>
        `).join('');

        console.log(`✅ Rendered ${categoriesToRender.length} categories`);
    }

    getSalesPerformance(sales) {
        if (sales === 0) return 'No sales';
        if (sales < 10) return 'Low';
        if (sales < 50) return 'Medium';
        if (sales < 100) return 'High';
        return 'Excellent';
    }

    filterByCategory(category) {
        this.switchSection('menu');
        document.getElementById('categoryFilter').value = category;
        this.filterItems();
        this.showMessage(`Showing items in: ${category === 'all' ? 'All Categories' : category}`, 'success');
    }

    // ==================== ANALYTICS ====================
    async loadAnalytics() {
        try {
            console.log("📥 Loading analytics...");
            this.showLoading(true);

            const [overviewResponse, salesResponse, performanceResponse] = await Promise.all([
                fetch('/api/analytics/overview'),
                fetch('/api/analytics/sales-data'),
                fetch('/api/analytics/performance')
            ]);

            if (!overviewResponse.ok || !salesResponse.ok || !performanceResponse.ok) {
                throw new Error('Failed to load analytics data');
            }

            const overview = await overviewResponse.json();
            const salesData = await salesResponse.json();
            const performance = await performanceResponse.json();

            console.log("✅ Analytics data loaded");
            this.renderAnalyticsOverview(overview);
            this.renderPerformanceMetrics(performance);
            this.renderCharts(salesData, overview, performance);

        } catch (error) {
            console.error('❌ Error loading analytics:', error);
            this.showError('Failed to load analytics data');
        } finally {
            this.showLoading(false);
        }
    }

    renderAnalyticsOverview(overview) {
        const container = document.getElementById('analyticsOverview');
        if (!container) return;

        container.innerHTML = `
            <div class="analytics-stat">
                <div class="number">${overview.overview?.total_items || 0}</div>
                <div class="label">Total Items</div>
            </div>
            <div class="analytics-stat">
                <div class="number">${overview.overview?.available_items || 0}</div>
                <div class="label">Available</div>
            </div>
            <div class="analytics-stat">
                <div class="number">${overview.overview?.total_sales || 0}</div>
                <div class="label">Total Sales</div>
            </div>
            <div class="analytics-stat">
                <div class="number">${overview.overview?.total_categories || 0}</div>
                <div class="label">Categories</div>
            </div>
        `;
    }

    renderPerformanceMetrics(performance) {
        const container = document.getElementById('topItems');
        if (!container) return;

        if (!performance.popular_items || performance.popular_items.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-chart-line"></i>
                    <p>No sales data yet</p>
                    <small>Start recording orders to see analytics</small>
                </div>
            `;
            return;
        }

        container.innerHTML = performance.popular_items.map((item, index) => `
            <div class="top-item">
                <div class="item-info">
                    <span class="rank">${index + 1}</span>
                    <span class="name">${this.escapeHtml(item.name)}</span>
                </div>
                <div class="item-stats">
                    <span class="sales">${item.sales} orders</span>
                    <span class="revenue">$${item.revenue.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }

    renderCharts(salesData, overview, performance) {
        this.renderSalesChart(salesData);
        this.renderCategoryChart(overview);
    }

    renderSalesChart(salesData) {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        if (this.salesChart) {
            this.salesChart.destroy();
        }

        const dates = salesData.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const sales = salesData.map(d => d.sales);

        this.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Daily Orders',
                    data: sales,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    renderCategoryChart(overview) {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        const categories = overview.categories || [];
        const labels = categories.map(c => c.name);
        const data = categories.map(c => c.item_count);

        const backgroundColors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'
        ];

        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // ==================== DATABASE INFO ====================
    async loadDatabaseInfo() {
        try {
            console.log("📥 Loading database info...");
            const [dbInfoResponse, dbItemsResponse] = await Promise.all([
                fetch('/api/database/info'),
                fetch('/api/database/items')
            ]);

            if (!dbInfoResponse.ok || !dbItemsResponse.ok) {
                throw new Error('Failed to load database info');
            }

            const dbInfo = await dbInfoResponse.json();
            const dbItems = await dbItemsResponse.json();

            this.renderDatabaseInfo(dbInfo);
            this.renderDatabaseItems(dbItems);
        } catch (error) {
            console.error('❌ Error loading database info:', error);
            this.showError('Failed to load database information');
        }
    }

    renderDatabaseInfo(dbInfo) {
        const container = document.getElementById('databaseStats');
        if (!container) return;

        container.innerHTML = `
            <div class="db-stat">
                <span class="label">Total Items:</span>
                <span class="value">${dbInfo.total_items}</span>
            </div>
            <div class="db-stat">
                <span class="label">Categories:</span>
                <span class="value">${dbInfo.categories_count}</span>
            </div>
            <div class="db-stat">
                <span class="label">Database Size:</span>
                <span class="value">${dbInfo.db_size_mb} MB</span>
            </div>
            <div class="db-stat">
                <span class="label">Last Updated:</span>
                <span class="value">${new Date().toLocaleString()}</span>
            </div>
        `;
    }

    renderDatabaseItems(items) {
        const tableBody = document.querySelector('#databaseTable tbody');
        if (!tableBody) return;

        if (items.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray);">
                        <i class="fas fa-database"></i>
                        <h3>No items in database</h3>
                        <p>Add your first menu item to see it here!</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = items.map(item => `
            <tr>
                <td>${item.id}</td>
                <td><strong>${this.escapeHtml(item.name)}</strong></td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${this.escapeHtml(item.category)}</td>
                <td>${item.sales_count}</td>
                <td>
                    <span class="${item.is_available ? 'status-available' : 'status-unavailable'}">
                        ${item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                </td>
                <td>${item.created_at}</td>
            </tr>
        `).join('');
    }

    // ==================== ITEM OPERATIONS ====================
    async saveItem() {
        const formData = new FormData();
        const itemId = document.getElementById('itemId').value;

        formData.append('name', document.getElementById('name').value.trim());
        formData.append('price', document.getElementById('price').value);
        formData.append('description', document.getElementById('description').value.trim());
        formData.append('category', document.getElementById('category').value);
        formData.append('is_available', document.getElementById('availability').value);

        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (!formData.get('name') || !formData.get('price')) {
            this.showError('Please fill in all required fields');
            return;
        }

        try {
            this.showLoading(true);

            let response;
            if (this.currentEditingId) {
                response = await fetch(`/api/items/${this.currentEditingId}`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                response = await fetch('/api/items', {
                    method: 'POST',
                    body: formData
                });
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save item');
            }

            this.showMessage(
                this.currentEditingId ? 'Item updated successfully' : 'Item added successfully',
                'success'
            );

            this.closeModal();
            await this.refreshData();

        } catch (error) {
            this.showError(error.message);
            console.error('Error saving item:', error);
        } finally {
            this.showLoading(false);
        }
    }

    editItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        this.currentEditingId = itemId;
        document.getElementById('modalTitle').textContent = 'Edit Menu Item';
        document.getElementById('itemId').value = itemId;
        document.getElementById('name').value = item.name;
        document.getElementById('price').value = item.price;
        document.getElementById('description').value = item.description || '';
        document.getElementById('category').value = item.category;
        document.getElementById('availability').value = item.is_available.toString();

        const imagePreview = document.getElementById('imagePreview');
        if (item.image_url) {
            imagePreview.innerHTML = `<img src="${item.image_url}" alt="Preview">`;
            imagePreview.classList.add('has-image');
        } else {
            imagePreview.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click to upload image</p>
            `;
            imagePreview.classList.remove('has-image');
        }

        this.openModal();
    }

    async deleteItem(itemId) {
        if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }

        try {
            this.showLoading(true);
            const response = await fetch(`/api/items/${itemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete item');

            this.showMessage('Item deleted successfully', 'success');
            await this.refreshData();

        } catch (error) {
            this.showError('Failed to delete item');
            console.error('Error deleting item:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async toggleAvailability(itemId) {
        try {
            const response = await fetch(`/api/items/${itemId}/availability`, {
                method: 'PATCH'
            });

            if (!response.ok) throw new Error('Failed to update availability');

            this.showMessage('Availability updated successfully', 'success');
            await this.refreshData();

        } catch (error) {
            this.showError('Failed to update availability');
            console.error('Error updating availability:', error);
        }
    }

    // ==================== UTILITY METHODS ====================
    async refreshData() {
        await Promise.all([
            this.loadItems(),
            this.loadCategories(),
            this.loadCategoriesForFilter() // ✅ تحديث الفلاتر أيضاً
        ]);
        this.renderItems();
        this.updateStatistics();
    }

    openModal() {
        document.getElementById('itemModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('itemModal').style.display = 'none';
        this.resetForm();
    }

    resetForm() {
        document.getElementById('itemForm').reset();
        document.getElementById('modalTitle').textContent = 'Add New Menu Item';
        document.getElementById('itemId').value = '';

        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Click to upload image</p>
        `;
        imagePreview.classList.remove('has-image');

        this.currentEditingId = null;
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(messageDiv, mainContent.firstChild);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Global functions
function openModal() {
    if (app) app.openModal();
}

function closeModal() {
    if (app) app.closeModal();
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM Content Loaded");
    app = new RestaurantManagementSystem();
});

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('itemModal');
    if (event.target === modal) {
        closeModal();
    }
};

console.log("✅ Restaurant Management System Script Loaded");