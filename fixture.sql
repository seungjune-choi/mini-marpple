-- 카테고리 생성
INSERT INTO categories (name)
VALUES 
    ('Electronics'),
    ('Clothing'),
    ('Home & Kitchen');

-- 상품 생성
INSERT INTO products (category_id, name, description, price, stock_quantity, hidden)
VALUES 
    (1, 'Product 1', 'Description for Product 1', 1000, 50, FALSE),
    (2, 'Product 2', 'Description for Product 2', 2000, 40, FALSE),
    (3, 'Product 3', 'Description for Product 3', 3000, 30, TRUE),
    (1, 'Product 4', 'Description for Product 4', 4000, 20, FALSE),
    (2, 'Product 5', 'Description for Product 5', 5000, 10, TRUE),
    (3, 'Product 6', 'Description for Product 6', 6000, 60, FALSE),
    (1, 'Product 7', 'Description for Product 7', 7000, 70, TRUE),
    (2, 'Product 8', 'Description for Product 8', 8000, 80, FALSE),
    (3, 'Product 9', 'Description for Product 9', 9000, 90, TRUE),
    (1, 'Product 10', 'Description for Product 10', 10000, 100, FALSE),
    (2, 'Product 11', 'Description for Product 11', 11000, 110, TRUE),
    (3, 'Product 12', 'Description for Product 12', 12000, 120, FALSE),
    (1, 'Product 13', 'Description for Product 13', 13000, 130, TRUE),
    (2, 'Product 14', 'Description for Product 14', 14000, 140, FALSE),
    (3, 'Product 15', 'Description for Product 15', 15000, 150, TRUE),
    (1, 'Product 16', 'Description for Product 16', 16000, 160, FALSE),
    (2, 'Product 17', 'Description for Product 17', 17000, 170, TRUE),
    (3, 'Product 18', 'Description for Product 18', 18000, 180, FALSE),
    (1, 'Product 19', 'Description for Product 19', 19000, 190, TRUE),
    (2, 'Product 20', 'Description for Product 20', 20000, 200, FALSE);

-- 각 상품에 대해 3개의 이미지 추가 (첫 번째 이미지를 대표 이미지로 설정)
INSERT INTO product_images (product_id, path, is_representative)
VALUES 
    (1, '/images/product1_img1.jpg', TRUE),
    (1, '/images/product1_img2.jpg', FALSE),
    (1, '/images/product1_img3.jpg', FALSE),
    (2, '/images/product2_img1.jpg', TRUE),
    (2, '/images/product2_img2.jpg', FALSE),
    (2, '/images/product2_img3.jpg', FALSE),
    (3, '/images/product3_img1.jpg', TRUE),
    (3, '/images/product3_img2.jpg', FALSE),
    (3, '/images/product3_img3.jpg', FALSE),
    (4, '/images/product4_img1.jpg', TRUE),
    (4, '/images/product4_img2.jpg', FALSE),
    (4, '/images/product4_img3.jpg', FALSE),
    (5, '/images/product5_img1.jpg', TRUE),
    (5, '/images/product5_img2.jpg', FALSE),
    (5, '/images/product5_img3.jpg', FALSE),
    (6, '/images/product6_img1.jpg', TRUE),
    (6, '/images/product6_img2.jpg', FALSE),
    (6, '/images/product6_img3.jpg', FALSE),
    (7, '/images/product7_img1.jpg', TRUE),
    (7, '/images/product7_img2.jpg', FALSE),
    (7, '/images/product7_img3.jpg', FALSE),
    (8, '/images/product8_img1.jpg', TRUE),
    (8, '/images/product8_img2.jpg', FALSE),
    (8, '/images/product8_img3.jpg', FALSE),
    (9, '/images/product9_img1.jpg', TRUE),
    (9, '/images/product9_img2.jpg', FALSE),
    (9, '/images/product9_img3.jpg', FALSE),
    (10, '/images/product10_img1.jpg', TRUE),
    (10, '/images/product10_img2.jpg', FALSE),
    (10, '/images/product10_img3.jpg', FALSE),
    (11, '/images/product11_img1.jpg', TRUE),
    (11, '/images/product11_img2.jpg', FALSE),
    (11, '/images/product11_img3.jpg', FALSE),
    (12, '/images/product12_img1.jpg', TRUE),
    (12, '/images/product12_img2.jpg', FALSE),
    (12, '/images/product12_img3.jpg', FALSE),
    (13, '/images/product13_img1.jpg', TRUE),
    (13, '/images/product13_img2.jpg', FALSE),
    (13, '/images/product13_img3.jpg', FALSE),
    (14, '/images/product14_img1.jpg', TRUE),
    (14, '/images/product14_img2.jpg', FALSE),
    (14, '/images/product14_img3.jpg', FALSE),
    (15, '/images/product15_img1.jpg', TRUE),
    (15, '/images/product15_img2.jpg', FALSE),
    (15, '/images/product15_img3.jpg', FALSE),
    (16, '/images/product16_img1.jpg', TRUE),
    (16, '/images/product16_img2.jpg', FALSE),
    (16, '/images/product16_img3.jpg', FALSE),
    (17, '/images/product17_img1.jpg', TRUE),
    (17, '/images/product17_img2.jpg', FALSE),
    (17, '/images/product17_img3.jpg', FALSE),
    (18, '/images/product18_img1.jpg', TRUE),
    (18, '/images/product18_img2.jpg', FALSE),
    (18, '/images/product18_img3.jpg', FALSE),
    (19, '/images/product19_img1.jpg', TRUE),
    (19, '/images/product19_img2.jpg', FALSE),
    (19, '/images/product19_img3.jpg', FALSE),
    (20, '/images/product20_img1.jpg', TRUE),
    (20, '/images/product20_img2.jpg', FALSE),
    (20, '/images/product20_img3.jpg', FALSE);

