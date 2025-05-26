// Create and show interactive map
    function openDistrictsMap() {
        // Kerala districts with coordinates
        const districts = [
            { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, color: '#FF6B6B' },
            { name: 'Kollam', lat: 8.8932, lng: 76.6141, color: '#4ECDC4' },
            { name: 'Pathanamthitta', lat: 9.2648, lng: 76.7871, color: '#45B7D1' },
            { name: 'Alappuzha', lat: 9.4981, lng: 76.3388, color: '#96CEB4' },
            { name: 'Kottayam', lat: 9.5916, lng: 76.5222, color: '#FFEAA7' },
            { name: 'Idukki', lat: 9.8513, lng: 76.9120, color: '#DDA0DD' },
            { name: 'Ernakulam', lat: 9.9312, lng: 76.2673, color: '#98D8C8' },
            { name: 'Thrissur', lat: 10.5276, lng: 76.2144, color: '#F7DC6F' },
            { name: 'Palakkad', lat: 10.7867, lng: 76.6548, color: '#BB8FCE' },
            { name: 'Malappuram', lat: 11.0510, lng: 76.0711, color: '#85C1E9' },
            { name: 'Kozhikode', lat: 11.2588, lng: 75.7804, color: '#F8C471' },
            { name: 'Wayanad', lat: 11.6854, lng: 76.1320, color: '#82E0AA' },
            { name: 'Kannur', lat: 11.8745, lng: 75.3704, color: '#F1948A' },
            { name: 'Kasaragod', lat: 12.4996, lng: 74.9869, color: '#AED6F1' }
        ];
        
        // Create map modal
        const mapModal = document.createElement('div');
        mapModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        const mapContainer = document.createElement('div');
        mapContainer.style.cssText = `
            background: white;
            border-radius: 12px;
            width: 90%;
            height: 80%;
            max-width: 1000px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;
        
        const mapHeader = document.createElement('div');
        mapHeader.style.cssText = `
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        mapHeader.innerHTML = `
            <span><i class="fas fa-map-marked-alt me-2"></i>Kerala Districts Map</span>
            <button id="closeMap" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
        `;
        
        const mapContent = document.createElement('div');
        mapContent.style.cssText = `
            width: 100%;
            height: calc(100% - 60px);
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            overflow: hidden;
        `;
        
        // Create Kerala map visualization
        const svgMap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgMap.style.cssText = 'width: 100%; height: 100%;';
        
        // Add districts as interactive circles
        districts.forEach((district, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const x = ((district.lng - 74.5) / 2.5) * 100;
            const y = 100 - ((district.lat - 8) / 5) * 100;
            
            circle.setAttribute('cx', `${x}%`);
            circle.setAttribute('cy', `${y}%`);
            circle.setAttribute('r', '15');
            circle.setAttribute('fill', district.color);
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '2');
            circle.style.cssText = `
                cursor: pointer;
                transition: all 0.3s ease;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            `;
            
            // Add hover effects
            circle.addEventListener('mouseenter', function() {
                this.setAttribute('r', '20');
                this.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))';
            });
            
            circle.addEventListener('mouseleave', function() {
                this.setAttribute('r', '15');
                this.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
            });
            
            // Add click event to highlight district
            circle.addEventListener('click', function() {
                showDistrictInfo(district, x, y);
            });
            
            svgMap.appendChild(circle);
            
            // Add district labels
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', `${x}%`);
            text.setAttribute('y', `${y + 8}%`);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.style.cssText = `
                pointer-events: none;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
                font-family: 'Segoe UI', sans-serif;
            `;
            text.textContent = district.name;
            svgMap.appendChild(text);
        });
        
        // Show district information
        function showDistrictInfo(district, x, y) {
            // Remove existing info boxes
            const existingInfo = mapContent.querySelector('.district-info');
            if (existingInfo) existingInfo.remove();
            
            const infoBox = document.createElement('div');
            infoBox.className = 'district-info';
            infoBox.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                transform: translate(-50%, -120%);
                background: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                min-width: 200px;
                z-index: 100;
                animation: bounceIn 0.3s ease;
            `;
            
            const districtCard = Array.from(document.querySelectorAll('.card-title')).find(card => 
                card.textContent.toLowerCase().includes(district.name.toLowerCase()) ||
                district.name.toLowerCase().includes(card.textContent.toLowerCase().replace(/[^a-z]/g, ''))
            );
            
            let description = 'Beautiful district of Kerala';
            if (districtCard) {
                const cardText = districtCard.closest('.card').querySelector('.card-text');
                if (cardText) description = cardText.textContent;
            }
            
            infoBox.innerHTML = `
                <h6 style="color: var(--primary-color); margin: 0 0 0.5rem 0;">${district.name}</h6>
                <p style="margin: 0; font-size: 0.9rem; color: #666;">${description}</p>
                <button onclick="this.parentElement.remove()" style="
                    position: absolute;
                    top: 5px;
                    right: 8px;
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #999;
                    cursor: pointer;
                ">×</button>
            `;
            
            mapContent.appendChild(infoBox);
        }
        
        // Assemble modal
        mapContainer.appendChild(mapHeader);
        mapContent.appendChild(svgMap);
        mapContainer.appendChild(mapContent);
        mapModal.appendChild(mapContainer);
        document.body.appendChild(mapModal);
        
        // Close functionality
        document.getElementById('closeMap').addEventListener('click', function() {
            mapModal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => mapModal.remove(), 300);
        });
        
        mapModal.addEventListener('click', function(e) {
            if (e.target === mapModal) {
                mapModal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => mapModal.remove(), 300);
            }
        });
        
        // Add bounce animation
        const bounceStyle = document.createElement('style');
        bounceStyle.textContent = `
            @keyframes bounceIn {
                0% { transform: translate(-50%, -120%) scale(0.3); opacity: 0; }
                50% { transform: translate(-50%, -120%) scale(1.05); }
                70% { transform: translate(-50%, -120%) scale(0.9); }
                100% { transform: translate(-50%, -120%) scale(1); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(bounceStyle);
    }