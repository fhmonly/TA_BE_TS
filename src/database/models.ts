// database/migrations/2025XXXX_create_all_tables.js
import type { Knex } from 'knex';

export async function up(knex: Knex) {
  // Users
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('username').unique();
    table.string('password').notNullable();
    table.string('name');
    table.string('profile_picture');
    table.boolean('is_verified').defaultTo(false);
    table.string('refresh_token').defaultTo('');
    table.timestamps(true, true);
  });

  // Product Categories
  await knex.schema.createTable('product_categories', (table) => {
    table.increments('id').primary();
    table.string('category_name').notNullable();
    table.string('description');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
  });

  // Products
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('product_name').notNullable();
    table.integer('stock').notNullable();
    table.float('price').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('product_category_id').unsigned().references('id').inTable('product_categories').onDelete('SET NULL');
  });

  // Suppliers
  await knex.schema.createTable('suppliers', (table) => {
    table.increments('id').primary();
    table.string('supplier_name').notNullable();
    table.string('contact');
    table.string('address');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
  });

  // Purchases
  await knex.schema.createTable('purchases', (table) => {
    table.increments('id').primary();
    table.date('buying_date').defaultTo(knex.fn.now()).notNullable();
    table.integer('amount').notNullable();
    table.float('total_price').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
    table.integer('supplier_id').unsigned().references('id').inTable('suppliers').onDelete('CASCADE');
  });

  // Transactions
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.date('transaction_date').defaultTo(knex.fn.now()).notNullable();
    table.integer('amount').notNullable();
    table.float('total_price').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
  });

  // Predictions
  await knex.schema.createTable('predictions', (table) => {
    table.increments('id').primary();
    table.integer('stock_sold').notNullable();
    table.integer('stock_predicted').notNullable();
    table.string('type').notNullable();
    table.float('accuracy');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
  });

  // User Files
  await knex.schema.createTable('user_files', (table) => {
    table.increments('id').primary();
    table.string('file_name').notNullable();
    table.string('saved_file_name').notNullable().unique();
    table.boolean('is_converted').defaultTo(false);
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  await knex.schema
    .dropTableIfExists('user_files')
    .dropTableIfExists('predictions')
    .dropTableIfExists('transactions')
    .dropTableIfExists('purchases')
    .dropTableIfExists('suppliers')
    .dropTableIfExists('products')
    .dropTableIfExists('product_categories')
    .dropTableIfExists('users');
}
