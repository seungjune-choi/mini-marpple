-- 카테고리 테이블: 카테고리 ID와 이름을 저장하는 테이블
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 상품 정보 테이블: 상품에 대한 기본 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    hidden BOOLEAN DEFAULT FALSE
);

-- 썸네일 테이블: 각 상품에 대한 여러 썸네일을 저장
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    path VARCHAR(255) NOT NULL,
    is_representative BOOLEAN DEFAULT FALSE
);

-- 장바구니 테이블
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 장바구니 항목 테이블
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id)
);

-- 주문 테이블
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    merchant_uid VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 주문 항목 테이블 (order_item)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    price_at_order DECIMAL(10, 2) NOT NULL, -- 주문 시점의 가격
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 결제 테이블
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'successful',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS inventory_reservations (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    order_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Index 설정
-- inventory_reservations 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_inventory_reservation_product_id ON inventory_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_reservation_order_id ON inventory_reservations(order_id);

-- cart 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON carts(user_id) WHERE deleted_at IS NULL;

-- cart_item 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id ON cart_items(cart_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cart_item_product_id ON cart_items(product_id) WHERE deleted_at IS NULL;

-- order 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_order_user_id ON orders(user_id) WHERE deleted_at IS NULL;

-- order_item 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON order_items(order_id) WHERE deleted_at IS NULL;

-- payment 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_payment_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_user_id ON payments(user_id);

-- 각 상품당 하나의 대표 이미지만 존재하도록 제약 조건 추가
CREATE UNIQUE INDEX IF NOT EXISTS idx_representative_thumbnail ON product_images (product_id) WHERE is_representative = TRUE;

-- 카테고리로 상품을 조회하기 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_category_id ON products (category_id);

-- Orders 테이블의 user_id 컬럼에 외래 키 설정
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user_id
FOREIGN KEY (user_id)
REFERENCES users (id)
ON DELETE CASCADE;

-- Payments 테이블의 user_id 컬럼에 외래 키 설정
ALTER TABLE payments
ADD CONSTRAINT fk_payments_user_id
FOREIGN KEY (user_id)
REFERENCES users (id)
ON DELETE CASCADE;

-- Carts 테이블의 user_id 컬럼에 외래 키 설정
ALTER TABLE carts
ADD CONSTRAINT fk_carts_user_id
FOREIGN KEY (user_id)
REFERENCES users (id)
ON DELETE CASCADE;
