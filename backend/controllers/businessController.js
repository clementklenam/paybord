const Business = require('../models/Business');
const { validationResult } = require('express-validator');

/**
 * @desc    Register a new business
 * @route   POST /api/business/register
 * @access  Private
 */
const registerBusiness = async (req, res) => {
    console.log('Business registration request body:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if user already has a business
        const existingBusiness = await Business.findOne({ user: req.user._id });

        if (existingBusiness) {
            return res.status(400).json({ error: 'User already has a registered business' });
        }

        // Create business object with required fields
        const businessData = {
            user: req.user._id,
            businessName: req.body.businessName,
            businessType: req.body.businessType,
            industry: req.body.industry,
            email: req.body.email,
            phone: req.body.phone,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state,
                postalCode: req.body.address.postalCode,
                country: req.body.address.country
            },
            bankingInfo: {
                bankName: req.body.bankingInfo.bankName,
                accountNumber: req.body.bankingInfo.accountNumber,
                accountName: req.body.bankingInfo.accountName,
                swiftCode: req.body.bankingInfo.swiftCode,
                routingNumber: req.body.bankingInfo.routingNumber
            }
        };

        // Add optional fields if provided
        if (req.body.registrationNumber) businessData.registrationNumber = req.body.registrationNumber;
        if (req.body.taxId) businessData.taxId = req.body.taxId;
        if (req.body.website) businessData.website = req.body.website;
        if (req.body.currency) businessData.currency = req.body.currency;

        // Add mobile money info if provided
        if (req.body.mobileMoneyInfo) {
            businessData.mobileMoneyInfo = {
                provider: req.body.mobileMoneyInfo.provider,
                accountNumber: req.body.mobileMoneyInfo.accountNumber,
                accountName: req.body.mobileMoneyInfo.accountName
            };
        }

        // Add compliance info if provided
        if (req.body.complianceInfo) {
            businessData.complianceInfo = {
                pciDssCompliant: req.body.complianceInfo.pciDssCompliant || false,
                pciDssLevel: req.body.complianceInfo.pciDssLevel || 'not_applicable'
            };

            if (req.body.complianceInfo.dataSecurityOfficer) {
                businessData.complianceInfo.dataSecurityOfficer = {
                    name: req.body.complianceInfo.dataSecurityOfficer.name,
                    email: req.body.complianceInfo.dataSecurityOfficer.email,
                    phone: req.body.complianceInfo.dataSecurityOfficer.phone
                };
            }

            if (req.body.complianceInfo.dataProtectionPolicy) {
                businessData.complianceInfo.dataProtectionPolicy = {
                    exists: req.body.complianceInfo.dataProtectionPolicy.exists || false,
                    lastUpdated: req.body.complianceInfo.dataProtectionPolicy.lastUpdated
                };
            }
        }

        // Create new business
        console.log('Creating new business with data:', JSON.stringify(businessData, null, 2));
        const business = new Business(businessData);
        
        try {
            await business.save();
            console.log('Business created successfully with ID:', business._id);
            
            res.status(201).json({
                success: true,
                business: {
                    _id: business._id,
                    businessName: business.businessName,
                    merchantId: business.merchantId,
                    verificationStatus: business.verificationStatus,
                    status: business.status
                }
            });
        } catch (saveError) {
            console.error('Error saving business:', saveError);
            return res.status(500).json({ error: 'Error saving business', details: saveError.message });
        }
    } catch (error) {
        console.error('Business registration error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get business profile
 * @route   GET /api/business/profile
 * @access  Private
 */
const getBusinessProfile = async (req, res) => {
    try {
        console.log('Getting business profile for user ID:', req.user._id);
        
        const business = await Business.findOne({ user: req.user._id });
        console.log('Business found:', business ? 'Yes' : 'No');
        
        if (!business) {
            console.log('No business found for user ID:', req.user._id);
            return res.status(404).json({ error: 'Business not found' });
        }
        
        console.log('Returning business profile with name:', business.businessName);
        res.json(business);
    } catch (error) {
        console.error('Get business profile error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Update business profile
 * @route   PUT /api/business/profile
 * @access  Private
 */
const updateBusinessProfile = async (req, res) => {
    try {
        const business = await Business.findOne({ user: req.user._id });

        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        // Update basic fields if provided
        if (req.body.businessName) business.businessName = req.body.businessName;
        if (req.body.businessType) business.businessType = req.body.businessType;
        if (req.body.registrationNumber) business.registrationNumber = req.body.registrationNumber;
        if (req.body.taxId) business.taxId = req.body.taxId;
        if (req.body.industry) business.industry = req.body.industry;
        if (req.body.website) business.website = req.body.website;
        if (req.body.email) business.email = req.body.email;
        if (req.body.phone) business.phone = req.body.phone;
        if (req.body.currency) business.currency = req.body.currency;

        // Update address if provided
        if (req.body.address) {
            if (req.body.address.street) business.address.street = req.body.address.street;
            if (req.body.address.city) business.address.city = req.body.address.city;
            if (req.body.address.state) business.address.state = req.body.address.state;
            if (req.body.address.postalCode) business.address.postalCode = req.body.address.postalCode;
            if (req.body.address.country) business.address.country = req.body.address.country;
        }

        // Update banking info if provided
        if (req.body.bankingInfo) {
            if (req.body.bankingInfo.bankName) business.bankingInfo.bankName = req.body.bankingInfo.bankName;
            if (req.body.bankingInfo.accountNumber) business.bankingInfo.accountNumber = req.body.bankingInfo.accountNumber;
            if (req.body.bankingInfo.accountName) business.bankingInfo.accountName = req.body.bankingInfo.accountName;
            if (req.body.bankingInfo.swiftCode) business.bankingInfo.swiftCode = req.body.bankingInfo.swiftCode;
            if (req.body.bankingInfo.routingNumber) business.bankingInfo.routingNumber = req.body.bankingInfo.routingNumber;
        }

        // Update mobile money info if provided
        if (req.body.mobileMoneyInfo) {
            business.mobileMoneyInfo = business.mobileMoneyInfo || {};
            if (req.body.mobileMoneyInfo.provider) business.mobileMoneyInfo.provider = req.body.mobileMoneyInfo.provider;
            if (req.body.mobileMoneyInfo.accountNumber) business.mobileMoneyInfo.accountNumber = req.body.mobileMoneyInfo.accountNumber;
            if (req.body.mobileMoneyInfo.accountName) business.mobileMoneyInfo.accountName = req.body.mobileMoneyInfo.accountName;
        }

        // Update compliance info if provided
        if (req.body.complianceInfo) {
            business.complianceInfo = business.complianceInfo || {};
            if (req.body.complianceInfo.pciDssCompliant !== undefined) {
                business.complianceInfo.pciDssCompliant = req.body.complianceInfo.pciDssCompliant;
            }
            if (req.body.complianceInfo.pciDssLevel) {
                business.complianceInfo.pciDssLevel = req.body.complianceInfo.pciDssLevel;
            }

            if (req.body.complianceInfo.dataSecurityOfficer) {
                business.complianceInfo.dataSecurityOfficer = business.complianceInfo.dataSecurityOfficer || {};
                if (req.body.complianceInfo.dataSecurityOfficer.name) {
                    business.complianceInfo.dataSecurityOfficer.name = req.body.complianceInfo.dataSecurityOfficer.name;
                }
                if (req.body.complianceInfo.dataSecurityOfficer.email) {
                    business.complianceInfo.dataSecurityOfficer.email = req.body.complianceInfo.dataSecurityOfficer.email;
                }
                if (req.body.complianceInfo.dataSecurityOfficer.phone) {
                    business.complianceInfo.dataSecurityOfficer.phone = req.body.complianceInfo.dataSecurityOfficer.phone;
                }
            }

            if (req.body.complianceInfo.dataProtectionPolicy) {
                business.complianceInfo.dataProtectionPolicy = business.complianceInfo.dataProtectionPolicy || {};
                if (req.body.complianceInfo.dataProtectionPolicy.exists !== undefined) {
                    business.complianceInfo.dataProtectionPolicy.exists = req.body.complianceInfo.dataProtectionPolicy.exists;
                }
                if (req.body.complianceInfo.dataProtectionPolicy.lastUpdated) {
                    business.complianceInfo.dataProtectionPolicy.lastUpdated = req.body.complianceInfo.dataProtectionPolicy.lastUpdated;
                }
            }
        }

        await business.save();

        res.json({
            success: true,
            business
        });
    } catch (error) {
        console.error('Update business profile error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Upload verification document
 * @route   POST /api/business/upload-document/:documentType
 * @access  Private
 */
const uploadVerificationDocument = async (req, res) => {
    try {
        // Get the document type from the URL parameter
        const { documentType } = req.params;
        
        if (!documentType) {
            return res.status(400).json({ error: 'Document type is required as a URL parameter' });
        }
        
        console.log(`Processing document upload for type: ${documentType}`);
        
        const business = await Business.findOne({ user: req.user._id });

        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        // In a real implementation, you would handle file upload to a service like AWS S3
        // and store the URL in the database
        const documentUrl = 'https://example.com/documents/' + Date.now(); // Placeholder URL

        business.verificationDocuments.push({
            documentType,
            documentUrl: documentUrl,
            uploadDate: Date.now(),
            status: 'pending'
        });

        // Update verification status if it's the first document
        if (business.verificationStatus === 'unverified') {
            business.verificationStatus = 'pending';
        }

        await business.save();

        res.json({
            success: true,
            document: business.verificationDocuments[business.verificationDocuments.length - 1]
        });
    } catch (error) {
        console.error('Upload verification document error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Check business verification status
 * @route   GET /api/business/verification-status
 * @access  Private
 */
const checkVerificationStatus = async (req, res) => {
    try {
        const business = await Business.findOne({ user: req.user._id });

        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        res.json({
            verificationStatus: business.verificationStatus,
            documents: business.verificationDocuments
        });
    } catch (error) {
        console.error('Check verification status error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    registerBusiness,
    getBusinessProfile,
    updateBusinessProfile,
    uploadVerificationDocument,
    checkVerificationStatus
};
