from apps.common.enums import (
    AccountType,
    CashFlowCategory,
    NormalBalance,
)


CHART_OF_ACCOUNTS = [

    # =========================================================
    # ASSETS
    # =========================================================

    {
        "code": "1000",
        "name": "Assets",
        "type": AccountType.ASSET,
        "children": [

            {
                "code": "1100",
                "name": "Current Assets",
                "type": AccountType.ASSET,
                "children": [

                    {
                        "code": "1110",
                        "name": "Cash On Hand",
                        "type": AccountType.ASSET,
                        "cash_flow_category": CashFlowCategory.OPERATING,
                    },

                    {
                        "code": "1120",
                        "name": "Bank",
                        "type": AccountType.ASSET,
                        "cash_flow_category": CashFlowCategory.OPERATING,
                    },

                    {
                        "code": "1130",
                        "name": "Accounts Receivable",
                        "type": AccountType.ASSET,
                    },

                    {
                        "code": "1140",
                        "name": "Inventory",
                        "type": AccountType.ASSET,
                        "children": [

                            {
                                "code": "1141",
                                "name": "Merchandise Inventory",
                                "type": AccountType.ASSET,
                            },

                            {
                                "code": "1142",
                                "name": "Inventory Adjustments",
                                "type": AccountType.ASSET,
                            },

                        ],
                    },

                ],
            },

        ],
    },


    # =========================================================
    # LIABILITIES
    # =========================================================

    {
        "code": "2000",
        "name": "Liabilities",
        "type": AccountType.LIABILITY,
        "children": [

            {
                "code": "2100",
                "name": "Current Liabilities",
                "type": AccountType.LIABILITY,
                "children": [

                    {
                        "code": "2110",
                        "name": "Accounts Payable",
                        "type": AccountType.LIABILITY,
                    },

                ],
            },

        ],
    },


    # =========================================================
    # EQUITY
    # =========================================================

    {
        "code": "3000",
        "name": "Equity",
        "type": AccountType.EQUITY,
        "children": [

            {
                "code": "3100",
                "name": "Owner Capital",
                "type": AccountType.EQUITY,
            },

            {
                "code": "3200",
                "name": "Retained Earnings",
                "type": AccountType.EQUITY,
            },

            {
                "code": "3900",
                "name": "Income Summary",
                "type": AccountType.EQUITY,
            },

        ],
    },


    # =========================================================
    # REVENUE
    # =========================================================

    {
        "code": "4000",
        "name": "Revenue",
        "type": AccountType.REVENUE,
        "children": [

            {
                "code": "4100",
                "name": "Sales Revenue",
                "type": AccountType.REVENUE,
            },

        ],
    },


    # =========================================================
    # COST OF GOODS SOLD
    # =========================================================

    {
        "code": "5000",
        "name": "Cost of Goods Sold",
        "type": AccountType.EXPENSE,
        "children": [

            {
                "code": "5100",
                "name": "Cost of Goods Sold",
                "type": AccountType.EXPENSE,
            },

        ],
    },


    # =========================================================
    # OPERATING EXPENSES
    # =========================================================

    {
        "code": "6000",
        "name": "Operating Expenses",
        "type": AccountType.EXPENSE,
        "children": [

            {
                "code": "6100",
                "name": "Rent Expense",
                "type": AccountType.EXPENSE,
            },

            {
                "code": "6200",
                "name": "Salary Expense",
                "type": AccountType.EXPENSE,
            },

            {
                "code": "6300",
                "name": "Utilities Expense",
                "type": AccountType.EXPENSE,
            },

            {
                "code": "6400",
                "name": "Transportation Expense",
                "type": AccountType.EXPENSE,
            },

            {
                "code": "6500",
                "name": "Cash Over / Short",
                "type": AccountType.EXPENSE,
            },

        ],
    },

]