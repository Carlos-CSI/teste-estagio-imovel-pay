-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Customer_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Charge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDENTE', 'PAGO', 'CANCELADO', 'VENCIDO') NOT NULL DEFAULT 'PENDENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Charge_status_idx`(`status`),
    INDEX `Charge_due_date_idx`(`due_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chargeId` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `method` ENUM('PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO', 'BANK_TRANSFER') NULL,

    UNIQUE INDEX `Payment_chargeId_key`(`chargeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Charge` ADD CONSTRAINT `Charge_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_chargeId_fkey` FOREIGN KEY (`chargeId`) REFERENCES `Charge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
