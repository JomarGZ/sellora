<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shopping_cart_items', function (Blueprint $table) {
            $table->timestamp('priority_at')
                ->nullable()
                ->after('quantity')
                ->index();
        });
    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shopping_cart_items', function (Blueprint $table) {
             $table->dropColumn('priority_at');
        });
    }
};
