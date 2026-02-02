-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'GROOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BreedCategory" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'SPECIAL', 'SHORT_HAIR', 'LONG_HAIR');

-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('DOG', 'CAT');

-- CreateEnum
CREATE TYPE "PetGender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CatHairType" AS ENUM ('SHORT_HAIR', 'LONG_HAIR');

-- CreateEnum
CREATE TYPE "VaccinationStatus" AS ENUM ('UP_TO_DATE', 'OVERDUE', 'PARTIAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('FIRST_PAYMENT_PENDING', 'FIRST_PAYMENT_COMPLETE', 'FIRST_PAYMENT_VERIFY', 'GROOMER_CONFIRM_PENDING', 'GROOMER_CONFIRM', 'ADDITIONAL_PAYMENT_PENDING', 'ADDITIONAL_PAYMENT_COMPLETE', 'WORK_IN_PROGRESS', 'SERVICE_COMPLETED', 'SERVICE_CANCELLED', 'BOOKING_FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'AUTHORIZED', 'CAPTURED', 'COMPLETED', 'FAILED', 'CANCELLED', 'PARTIAL_CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'KAKAO_PAY', 'NAVER_PAY', 'TOSS', 'PAYPAL', 'CASH');

-- CreateEnum
CREATE TYPE "SettlementJobType" AS ENUM ('WEEKLY_SETTLEMENT', 'MANUAL_SETTLEMENT', 'RETRY_SETTLEMENT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SettlementCycle" AS ENUM ('WEEKLY_TUESDAY', 'MANUAL');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'CALCULATED', 'READY_FOR_PAYOUT', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'PUSH', 'EMAIL', 'SMS', 'BOOKING_REMINDER', 'ADMIN_MESSAGE');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('VERIFICATION', 'PASSWORD_RESET', 'NOTIFICATION', 'BOOKING_REMINDER');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "TaskTypes" AS ENUM ('NONE', 'PAYMENT_CLEANUP', 'BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "phoneNumber" TEXT,
    "phoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "deviceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breed" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "petType" "PetType" NOT NULL,
    "category" "BreedCategory" NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PetType" NOT NULL,
    "breedId" TEXT,
    "weight" DOUBLE PRECISION,
    "age" INTEGER,
    "birthDate" TIMESTAMP(3),
    "gender" "PetGender",
    "hairType" "CatHairType",
    "specialNeeds" TEXT,
    "vaccinationStatus" "VaccinationStatus" NOT NULL DEFAULT 'UNKNOWN',
    "vaccinationDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "termsAcception" BOOLEAN NOT NULL DEFAULT false,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "requiresVaccination" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePetType" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "petType" "PetType" NOT NULL,

    CONSTRAINT "ServicePetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBreedCategory" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "breedCategory" "BreedCategory" NOT NULL,

    CONSTRAINT "ServiceBreedCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePriceRange" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "petType" "PetType" NOT NULL,
    "minWeight" DOUBLE PRECISION DEFAULT 0,
    "maxWeight" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePriceRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePriceBreed" (
    "id" TEXT NOT NULL,
    "servicePriceRangeId" TEXT NOT NULL,
    "breedId" TEXT NOT NULL,

    CONSTRAINT "ServicePriceBreed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'KR',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "centerLat" DOUBLE PRECISION,
    "centerLng" DOUBLE PRECISION,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "groomerId" TEXT,
    "petId" TEXT,
    "customerAddressId" TEXT,
    "paymentId" TEXT,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "serviceTime" TEXT NOT NULL,
    "estimatedDurationMinutes" INTEGER NOT NULL,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "status" "BookingStatus" NOT NULL DEFAULT 'FIRST_PAYMENT_PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "serviceType" TEXT NOT NULL,
    "serviceDescription" TEXT,
    "specialRequests" TEXT,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "additionalCharges" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "cancelledBy" TEXT,
    "customerRating" INTEGER,
    "customerReview" TEXT,
    "reviewDate" TIMESTAMP(3),
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "requiresPickup" BOOLEAN NOT NULL DEFAULT false,
    "requiresDropoff" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "idempotencyKey" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingPet" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,

    CONSTRAINT "BookingPet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingService" (
    "id" TEXT NOT NULL,
    "bookingPetId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "servicePrice" DOUBLE PRECISION NOT NULL,
    "serviceDurationMinutes" INTEGER,

    CONSTRAINT "BookingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "applicableCategories" "BreedCategory"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingPetOption" (
    "id" TEXT NOT NULL,
    "bookingPetId" TEXT NOT NULL,
    "serviceOptionId" TEXT NOT NULL,
    "optionPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingPetOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "customerId" TEXT,
    "paymentId" TEXT NOT NULL,
    "pgTxId" TEXT,
    "orderId" TEXT,
    "orderName" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "method" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "receiptUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "failReason" TEXT,
    "cancelReason" TEXT,
    "cancelledAmount" DOUBLE PRECISION,
    "virtualAccount" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewImage" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewResponse" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerWorkArea" (
    "id" TEXT NOT NULL,
    "groomerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "radiusKm" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerWorkArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerSchedule" (
    "id" TEXT NOT NULL,
    "groomerId" TEXT NOT NULL,
    "workingDays" INTEGER[],
    "workingHoursStart" TEXT NOT NULL,
    "workingHoursEnd" TEXT NOT NULL,
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerWorkingDate" (
    "id" TEXT NOT NULL,
    "groomerId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerWorkingDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerAvailability" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT,
    "workingDateId" TEXT,
    "groomerId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerCommissionGrade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerCommissionGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerProfile" (
    "id" TEXT NOT NULL,
    "groomerId" TEXT NOT NULL,
    "commissionGradeId" TEXT,
    "birthDate" DATE,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankAccountHolderName" TEXT,
    "portonePartnerId" TEXT,
    "portoneContractId" TEXT,
    "settlementCycle" "SettlementCycle" NOT NULL DEFAULT 'WEEKLY_TUESDAY',
    "isSettlementActive" BOOLEAN NOT NULL DEFAULT true,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 3.3,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerSettlement" (
    "id" TEXT NOT NULL,
    "groomerId" TEXT NOT NULL,
    "groomerProfileId" TEXT NOT NULL,
    "settlementDate" DATE NOT NULL,
    "periodStartDate" DATE NOT NULL,
    "periodEndDate" DATE NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "netSettlementAmount" DOUBLE PRECISION NOT NULL,
    "portoneSettlementId" TEXT,
    "portoneTransferId" TEXT,
    "portonePayoutId" TEXT,
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "bookingCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroomerSettlementDetail" (
    "id" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "groomerProfileId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "serviceAmount" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroomerSettlementDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementBatch" (
    "id" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "settlementDate" DATE NOT NULL,
    "totalGroomers" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalTaxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNetAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "portoneBatchId" TEXT,
    "portonePayoutBatchId" TEXT,
    "status" "BatchStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettlementBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementJob" (
    "id" TEXT NOT NULL,
    "jobType" "SettlementJobType" NOT NULL DEFAULT 'WEEKLY_SETTLEMENT',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "groomerId" TEXT,
    "periodStartDate" TIMESTAMP(3),
    "periodEndDate" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastError" TEXT,
    "result" JSONB,
    "createdBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettlementJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortOneContract" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "platformFeeType" TEXT NOT NULL DEFAULT 'RATIO',
    "platformFeeValue" DOUBLE PRECISION NOT NULL,
    "settlementCycleType" TEXT NOT NULL DEFAULT 'WEEKLY',
    "settlementLagDays" INTEGER NOT NULL DEFAULT 2,
    "platformFeeVatPayer" TEXT NOT NULL DEFAULT 'PARTNER',
    "subtractPaymentVatOnPartnerSettlement" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortOneContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "type" "EmailType" NOT NULL,
    "status" "EmailStatus" NOT NULL,
    "messageId" TEXT,
    "error" TEXT,
    "processingTime" INTEGER,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskQueue" (
    "id" TEXT NOT NULL,
    "type" "TaskTypes" NOT NULL,
    "jobId" TEXT,
    "payload" JSONB NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "retry" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduledAt" TIMESTAMP(3),

    CONSTRAINT "TaskQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_token_key" ON "DeviceToken"("token");

-- CreateIndex
CREATE INDEX "DeviceToken_userId_idx" ON "DeviceToken"("userId");

-- CreateIndex
CREATE INDEX "DeviceToken_token_idx" ON "DeviceToken"("token");

-- CreateIndex
CREATE INDEX "Breed_petType_category_idx" ON "Breed"("petType", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Breed_name_petType_key" ON "Breed"("name", "petType");

-- CreateIndex
CREATE INDEX "PetImage_petId_idx" ON "PetImage"("petId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePetType_serviceId_petType_key" ON "ServicePetType"("serviceId", "petType");

-- CreateIndex
CREATE INDEX "ServiceBreedCategory_serviceId_idx" ON "ServiceBreedCategory"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceBreedCategory_breedCategory_idx" ON "ServiceBreedCategory"("breedCategory");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceBreedCategory_serviceId_breedCategory_key" ON "ServiceBreedCategory"("serviceId", "breedCategory");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePriceRange_serviceId_petType_minWeight_key" ON "ServicePriceRange"("serviceId", "petType", "minWeight");

-- CreateIndex
CREATE INDEX "ServicePriceBreed_servicePriceRangeId_idx" ON "ServicePriceBreed"("servicePriceRangeId");

-- CreateIndex
CREATE INDEX "ServicePriceBreed_breedId_idx" ON "ServicePriceBreed"("breedId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePriceBreed_servicePriceRangeId_breedId_key" ON "ServicePriceBreed"("servicePriceRangeId", "breedId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingNumber_key" ON "Booking"("bookingNumber");

-- CreateIndex
CREATE INDEX "Booking_idempotencyKey_customerId_idx" ON "Booking"("idempotencyKey", "customerId");

-- CreateIndex
CREATE INDEX "Booking_expiresAt_idx" ON "Booking"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingPet_bookingId_petId_key" ON "BookingPet"("bookingId", "petId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingService_bookingPetId_serviceId_key" ON "BookingService"("bookingPetId", "serviceId");

-- CreateIndex
CREATE INDEX "ServiceOption_isActive_idx" ON "ServiceOption"("isActive");

-- CreateIndex
CREATE INDEX "BookingPetOption_bookingPetId_idx" ON "BookingPetOption"("bookingPetId");

-- CreateIndex
CREATE INDEX "BookingPetOption_serviceOptionId_idx" ON "BookingPetOption"("serviceOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingPetOption_bookingPetId_serviceOptionId_key" ON "BookingPetOption"("bookingPetId", "serviceOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");

-- CreateIndex
CREATE INDEX "Payment_paymentId_idx" ON "Payment"("paymentId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_bookingId_status_createdAt_idx" ON "Payment"("bookingId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_customerId_key" ON "Review"("bookingId", "customerId");

-- CreateIndex
CREATE INDEX "ReviewImage_reviewId_idx" ON "ReviewImage"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewResponse_reviewId_key" ON "ReviewResponse"("reviewId");

-- CreateIndex
CREATE INDEX "GroomerWorkArea_groomerId_idx" ON "GroomerWorkArea"("groomerId");

-- CreateIndex
CREATE INDEX "GroomerWorkArea_centerLat_centerLng_idx" ON "GroomerWorkArea"("centerLat", "centerLng");

-- CreateIndex
CREATE UNIQUE INDEX "GroomerSchedule_groomerId_key" ON "GroomerSchedule"("groomerId");

-- CreateIndex
CREATE INDEX "GroomerSchedule_groomerId_idx" ON "GroomerSchedule"("groomerId");

-- CreateIndex
CREATE INDEX "GroomerWorkingDate_groomerId_idx" ON "GroomerWorkingDate"("groomerId");

-- CreateIndex
CREATE INDEX "GroomerWorkingDate_date_idx" ON "GroomerWorkingDate"("date");

-- CreateIndex
CREATE INDEX "GroomerWorkingDate_groomerId_date_idx" ON "GroomerWorkingDate"("groomerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "GroomerWorkingDate_groomerId_date_key" ON "GroomerWorkingDate"("groomerId", "date");

-- CreateIndex
CREATE INDEX "GroomerAvailability_groomerId_date_idx" ON "GroomerAvailability"("groomerId", "date");

-- CreateIndex
CREATE INDEX "GroomerAvailability_scheduleId_idx" ON "GroomerAvailability"("scheduleId");

-- CreateIndex
CREATE INDEX "GroomerAvailability_workingDateId_idx" ON "GroomerAvailability"("workingDateId");

-- CreateIndex
CREATE UNIQUE INDEX "GroomerAvailability_groomerId_date_timeSlot_key" ON "GroomerAvailability"("groomerId", "date", "timeSlot");

-- CreateIndex
CREATE INDEX "GroomerCommissionGrade_displayOrder_idx" ON "GroomerCommissionGrade"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GroomerProfile_groomerId_key" ON "GroomerProfile"("groomerId");

-- CreateIndex
CREATE UNIQUE INDEX "GroomerProfile_portonePartnerId_key" ON "GroomerProfile"("portonePartnerId");

-- CreateIndex
CREATE INDEX "GroomerProfile_groomerId_idx" ON "GroomerProfile"("groomerId");

-- CreateIndex
CREATE INDEX "GroomerProfile_commissionGradeId_idx" ON "GroomerProfile"("commissionGradeId");

-- CreateIndex
CREATE INDEX "GroomerProfile_portonePartnerId_idx" ON "GroomerProfile"("portonePartnerId");

-- CreateIndex
CREATE INDEX "GroomerProfile_portoneContractId_idx" ON "GroomerProfile"("portoneContractId");

-- CreateIndex
CREATE UNIQUE INDEX "GroomerSettlement_portoneSettlementId_key" ON "GroomerSettlement"("portoneSettlementId");

-- CreateIndex
CREATE INDEX "GroomerSettlement_groomerId_settlementDate_idx" ON "GroomerSettlement"("groomerId", "settlementDate");

-- CreateIndex
CREATE INDEX "GroomerSettlement_groomerProfileId_idx" ON "GroomerSettlement"("groomerProfileId");

-- CreateIndex
CREATE INDEX "GroomerSettlement_status_idx" ON "GroomerSettlement"("status");

-- CreateIndex
CREATE INDEX "GroomerSettlement_settlementDate_idx" ON "GroomerSettlement"("settlementDate");

-- CreateIndex
CREATE INDEX "GroomerSettlement_portoneSettlementId_idx" ON "GroomerSettlement"("portoneSettlementId");

-- CreateIndex
CREATE INDEX "GroomerSettlement_portoneTransferId_idx" ON "GroomerSettlement"("portoneTransferId");

-- CreateIndex
CREATE INDEX "GroomerSettlementDetail_settlementId_idx" ON "GroomerSettlementDetail"("settlementId");

-- CreateIndex
CREATE INDEX "GroomerSettlementDetail_groomerProfileId_idx" ON "GroomerSettlementDetail"("groomerProfileId");

-- CreateIndex
CREATE INDEX "GroomerSettlementDetail_bookingId_idx" ON "GroomerSettlementDetail"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "GroomerSettlementDetail_settlementId_bookingId_key" ON "GroomerSettlementDetail"("settlementId", "bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementBatch_batchNumber_key" ON "SettlementBatch"("batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementBatch_portoneBatchId_key" ON "SettlementBatch"("portoneBatchId");

-- CreateIndex
CREATE INDEX "SettlementBatch_settlementDate_idx" ON "SettlementBatch"("settlementDate");

-- CreateIndex
CREATE INDEX "SettlementBatch_status_idx" ON "SettlementBatch"("status");

-- CreateIndex
CREATE INDEX "SettlementJob_status_scheduledAt_idx" ON "SettlementJob"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "SettlementJob_jobType_status_idx" ON "SettlementJob"("jobType", "status");

-- CreateIndex
CREATE INDEX "SettlementJob_groomerId_idx" ON "SettlementJob"("groomerId");

-- CreateIndex
CREATE UNIQUE INDEX "PortOneContract_contractId_key" ON "PortOneContract"("contractId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "email_logs_email_idx" ON "email_logs"("email");

-- CreateIndex
CREATE INDEX "email_logs_type_idx" ON "email_logs"("type");

-- CreateIndex
CREATE INDEX "email_logs_status_idx" ON "email_logs"("status");

-- CreateIndex
CREATE INDEX "email_logs_userId_idx" ON "email_logs"("userId");

-- CreateIndex
CREATE INDEX "email_logs_createdAt_idx" ON "email_logs"("createdAt");

-- CreateIndex
CREATE INDEX "verification_identifier_expiresAt_idx" ON "verification"("identifier", "expiresAt");

-- CreateIndex
CREATE INDEX "TaskQueue_type_idx" ON "TaskQueue"("type");

-- CreateIndex
CREATE INDEX "TaskQueue_status_idx" ON "TaskQueue"("status");

-- CreateIndex
CREATE INDEX "TaskQueue_id_version_idx" ON "TaskQueue"("id", "version");

-- CreateIndex
CREATE INDEX "TaskQueue_type_jobId_idx" ON "TaskQueue"("type", "jobId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetImage" ADD CONSTRAINT "PetImage_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePetType" ADD CONSTRAINT "ServicePetType_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBreedCategory" ADD CONSTRAINT "ServiceBreedCategory_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePriceRange" ADD CONSTRAINT "ServicePriceRange_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePriceBreed" ADD CONSTRAINT "ServicePriceBreed_servicePriceRangeId_fkey" FOREIGN KEY ("servicePriceRangeId") REFERENCES "ServicePriceRange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePriceBreed" ADD CONSTRAINT "ServicePriceBreed_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerAddressId_fkey" FOREIGN KEY ("customerAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingPet" ADD CONSTRAINT "BookingPet_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingPet" ADD CONSTRAINT "BookingPet_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_bookingPetId_fkey" FOREIGN KEY ("bookingPetId") REFERENCES "BookingPet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingPetOption" ADD CONSTRAINT "BookingPetOption_bookingPetId_fkey" FOREIGN KEY ("bookingPetId") REFERENCES "BookingPet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingPetOption" ADD CONSTRAINT "BookingPetOption_serviceOptionId_fkey" FOREIGN KEY ("serviceOptionId") REFERENCES "ServiceOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewImage" ADD CONSTRAINT "ReviewImage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerWorkArea" ADD CONSTRAINT "GroomerWorkArea_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerSchedule" ADD CONSTRAINT "GroomerSchedule_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerWorkingDate" ADD CONSTRAINT "GroomerWorkingDate_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerAvailability" ADD CONSTRAINT "GroomerAvailability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "GroomerSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerAvailability" ADD CONSTRAINT "GroomerAvailability_workingDateId_fkey" FOREIGN KEY ("workingDateId") REFERENCES "GroomerWorkingDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerAvailability" ADD CONSTRAINT "GroomerAvailability_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerAvailability" ADD CONSTRAINT "GroomerAvailability_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerProfile" ADD CONSTRAINT "GroomerProfile_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerProfile" ADD CONSTRAINT "GroomerProfile_commissionGradeId_fkey" FOREIGN KEY ("commissionGradeId") REFERENCES "GroomerCommissionGrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerProfile" ADD CONSTRAINT "GroomerProfile_portoneContractId_fkey" FOREIGN KEY ("portoneContractId") REFERENCES "PortOneContract"("contractId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerSettlement" ADD CONSTRAINT "GroomerSettlement_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerSettlement" ADD CONSTRAINT "GroomerSettlement_groomerProfileId_fkey" FOREIGN KEY ("groomerProfileId") REFERENCES "GroomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerSettlementDetail" ADD CONSTRAINT "GroomerSettlementDetail_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "GroomerSettlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerSettlementDetail" ADD CONSTRAINT "GroomerSettlementDetail_groomerProfileId_fkey" FOREIGN KEY ("groomerProfileId") REFERENCES "GroomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroomerSettlementDetail" ADD CONSTRAINT "GroomerSettlementDetail_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementJob" ADD CONSTRAINT "SettlementJob_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
