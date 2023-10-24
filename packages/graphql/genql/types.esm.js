export default {
    "scalars": [
        1,
        3,
        4,
        5,
        6,
        8,
        10,
        17,
        19
    ],
    "types": {
        "CheckoutSession": {
            "checkoutUrl": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "Creation": {
            "completionStatus": [
                5
            ],
            "createdAt": [
                1
            ],
            "id": [
                3
            ],
            "iterationCount": [
                4
            ],
            "negativePrompt": [
                1
            ],
            "parentCreationId": [
                1
            ],
            "resultImageUrl": [
                1
            ],
            "startingImageUrl": [
                1
            ],
            "styles": [
                14
            ],
            "textPrompt": [
                1
            ],
            "updatedAt": [
                1
            ],
            "variationCount": [
                4
            ],
            "variations": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "ID": {},
        "Int": {},
        "CreationCompletionStatus": {},
        "Currency": {},
        "CurrencyToTotalDonation": {
            "EUR": [
                8
            ],
            "UAH": [
                8
            ],
            "USD": [
                8
            ],
            "__typename": [
                1
            ]
        },
        "Float": {},
        "Mutation": {
            "createCheckoutSession": [
                0,
                {
                    "amount": [
                        4,
                        "Int!"
                    ],
                    "currency": [
                        6,
                        "Currency!"
                    ]
                }
            ],
            "createSupportRequest": [
                10,
                {
                    "customerEmail": [
                        1,
                        "String!"
                    ],
                    "details": [
                        1,
                        "String!"
                    ],
                    "subject": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deleteCreation": [
                10,
                {
                    "creationId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deleteMyUser": [
                10
            ],
            "setCreationThumbnail": [
                2,
                {
                    "creationId": [
                        1,
                        "String!"
                    ],
                    "thumbnailUrl": [
                        1,
                        "String!"
                    ]
                }
            ],
            "setUserReferrerId": [
                18,
                {
                    "referrerId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "setVariationPublicity": [
                21,
                {
                    "isSharedToCommunity": [
                        4,
                        "Int!"
                    ],
                    "variationId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "Boolean": {},
        "PaginatedCreations": {
            "creations": [
                2
            ],
            "lastPage": [
                4
            ],
            "limit": [
                4
            ],
            "page": [
                4
            ],
            "total": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "PaginatedVariations": {
            "lastPage": [
                4
            ],
            "limit": [
                4
            ],
            "page": [
                4
            ],
            "total": [
                4
            ],
            "variations": [
                21
            ],
            "__typename": [
                1
            ]
        },
        "Query": {
            "creation": [
                2,
                {
                    "creationId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "me": [
                18
            ],
            "myCreations": [
                11,
                {
                    "limit": [
                        4
                    ],
                    "page": [
                        4
                    ]
                }
            ],
            "myStats": [
                20
            ],
            "sharedVariations": [
                12,
                {
                    "limit": [
                        4
                    ],
                    "page": [
                        4
                    ]
                }
            ],
            "styles": [
                14
            ],
            "surprisePrompts": [
                15
            ],
            "tokenAcquisition": [
                16,
                {
                    "tokenAcquisitionId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "user": [
                18,
                {
                    "id": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "Style": {
            "createdAt": [
                1
            ],
            "id": [
                3
            ],
            "imageUrl": [
                1
            ],
            "name": [
                1
            ],
            "prompt": [
                1
            ],
            "updatedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "SurprisePrompt": {
            "createdAt": [
                1
            ],
            "id": [
                3
            ],
            "prompt": [
                1
            ],
            "updatedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "TokenAcquisition": {
            "createdAt": [
                1
            ],
            "donationCurrencyToTokenExchangeRate": [
                8
            ],
            "id": [
                3
            ],
            "paymentProviderTransactionId": [
                1
            ],
            "status": [
                17
            ],
            "tokenNumber": [
                4
            ],
            "updatedAt": [
                1
            ],
            "userId": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "TokenAcquisitionStatus": {},
        "User": {
            "avatarUrl": [
                1
            ],
            "createdAt": [
                1
            ],
            "email": [
                1
            ],
            "firstName": [
                1
            ],
            "id": [
                3
            ],
            "isActive": [
                4
            ],
            "isLaunchWaitlistMember": [
                4
            ],
            "lastName": [
                1
            ],
            "role": [
                19
            ],
            "tokenNumber": [
                4
            ],
            "updatedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "UserRole": {},
        "UserStats": {
            "totalCreations": [
                4
            ],
            "totalDonationsByCurrency": [
                7
            ],
            "totalReferrals": [
                4
            ],
            "__typename": [
                1
            ]
        },
        "Variation": {
            "createdAt": [
                1
            ],
            "creation": [
                22
            ],
            "creationId": [
                3
            ],
            "id": [
                3
            ],
            "imageUrl": [
                1
            ],
            "isSharedToCommunity": [
                4
            ],
            "updatedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "VariationCreation": {
            "id": [
                3
            ],
            "iterationCount": [
                4
            ],
            "negativePrompt": [
                1
            ],
            "resultImageUrl": [
                1
            ],
            "startingImageUrl": [
                1
            ],
            "styles": [
                14
            ],
            "textPrompt": [
                1
            ],
            "variationCount": [
                4
            ],
            "__typename": [
                1
            ]
        }
    }
}