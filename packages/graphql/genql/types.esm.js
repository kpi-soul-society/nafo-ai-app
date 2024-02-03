export default {
    "scalars": [
        1,
        3,
        4,
        5,
        7,
        9,
        11,
        18,
        20
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
            "modeId": [
                1
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
                15
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
                22
            ],
            "__typename": [
                1
            ]
        },
        "ID": {},
        "Int": {},
        "CreationCompletionStatus": {},
        "CreationMode": {
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
            "updatedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Currency": {},
        "CurrencyToTotalDonation": {
            "EUR": [
                9
            ],
            "UAH": [
                9
            ],
            "USD": [
                9
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
                        7,
                        "Currency!"
                    ]
                }
            ],
            "createSupportRequest": [
                11,
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
                11,
                {
                    "creationId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "deleteMyUser": [
                11
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
                19,
                {
                    "referrerId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "setVariationPublicity": [
                22,
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
                22
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
            "creationModes": [
                6
            ],
            "me": [
                19
            ],
            "myCreations": [
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
            "myStats": [
                21
            ],
            "sharedVariations": [
                13,
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
                15
            ],
            "surprisePrompts": [
                16
            ],
            "tokenAcquisition": [
                17,
                {
                    "tokenAcquisitionId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "user": [
                19,
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
            "negativePrompt": [
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
                9
            ],
            "id": [
                3
            ],
            "paymentProviderTransactionId": [
                1
            ],
            "status": [
                18
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
                20
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
                8
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
                23
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
                15
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