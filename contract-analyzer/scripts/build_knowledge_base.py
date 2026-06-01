"""
WHAT THIS SCRIPT DOES:
Builds the standard Indian contract clause knowledge base in Qdrant.
This runs ONCE before starting the app.

WHY WE NEED THIS:
The LLM doesn't know YOUR standard templates.
We store 50 standard clauses as vectors in Qdrant.
When a user uploads a contract, we find the nearest standard clause
and tell the LLM "here is what a standard clause looks like — how does
this uploaded clause differ?"

This is the RETRIEVE step of RAG.
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
import uuid

# Connect to Qdrant running in Docker
client = QdrantClient(host="localhost", port=6333)

# Load the embedding model
# all-MiniLM-L6-v2: small, fast, 384-dimensional vectors
# Perfect for semantic search on CPU
print("Loading embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

# Collection name in Qdrant
COLLECTION_NAME = "indian_contract_clauses"

# ── CREATE COLLECTION ──
# Delete if exists (fresh start)
try:
    client.delete_collection(COLLECTION_NAME)
    print("Deleted existing collection")
except:
    pass

# Create new collection
# vectors_config: size=384 matches all-MiniLM-L6-v2 output
# distance=COSINE: measures angle between vectors (best for text)
client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(
        size=384,           # Must match embedding model output size
        distance=Distance.COSINE  # Cosine similarity for text
    )
)
print(f"Created collection: {COLLECTION_NAME}")

# ── STANDARD INDIAN CONTRACT CLAUSES ──
# These are YOUR knowledge base.
# Each clause has: text, type, contract_type, law_reference
standard_clauses = [

    # ── NDA CLAUSES ──
    {
        "text": "The receiving party shall keep confidential all information disclosed by the disclosing party and shall not disclose such information to any third party without prior written consent. This obligation shall survive termination of this agreement for a period of three (3) years.",
        "clause_type": "confidentiality",
        "contract_type": "NDA",
        "law_reference": "Indian Contract Act 1872 Section 27",
        "standard": "This is a standard NDA confidentiality clause with reasonable 3-year post-termination period."
    },
    {
        "text": "All intellectual property developed by either party during the course of this agreement shall remain the property of the respective creating party unless explicitly agreed otherwise in writing.",
        "clause_type": "ip_ownership",
        "contract_type": "NDA",
        "law_reference": "Companies Act 2013 Section 2(68)",
        "standard": "Standard IP ownership clause protecting both parties' independently created IP."
    },
    {
        "text": "This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising out of this agreement shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.",
        "clause_type": "jurisdiction",
        "contract_type": "NDA",
        "law_reference": "Code of Civil Procedure 1908 Section 20",
        "standard": "Standard jurisdiction clause specifying Indian courts and specific city."
    },
    {
        "text": "Either party may terminate this Agreement by providing thirty (30) days written notice to the other party. Upon termination, all confidential information must be returned or certified destroyed within seven (7) days.",
        "clause_type": "termination",
        "contract_type": "NDA",
        "law_reference": "Indian Contract Act 1872 Section 73",
        "standard": "Standard NDA termination with reasonable notice period and data return obligation."
    },
    {
        "text": "The receiving party's obligations under this agreement shall not apply to information that is publicly available through no fault of the receiving party, or was known to the receiving party prior to disclosure.",
        "clause_type": "confidentiality",
        "contract_type": "NDA",
        "law_reference": "Indian Contract Act 1872 Section 23",
        "standard": "Standard carve-out exceptions to confidentiality obligation."
    },
    {
        "text": "Neither party shall be liable for indirect, incidental, special or consequential damages arising out of or related to this agreement, even if advised of the possibility of such damages. Total liability shall not exceed INR 10,00,000.",
        "clause_type": "liability_cap",
        "contract_type": "NDA",
        "law_reference": "Indian Contract Act 1872 Section 73",
        "standard": "Standard liability cap clause with reasonable INR limit."
    },
    {
        "text": "Any dispute arising out of or in connection with this Agreement shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Mumbai.",
        "clause_type": "dispute_resolution",
        "contract_type": "NDA",
        "law_reference": "Arbitration and Conciliation Act 1996",
        "standard": "Standard arbitration clause compliant with Indian arbitration law."
    },

    # ── EMPLOYMENT AGREEMENT CLAUSES ──
    {
        "text": "The Employee's employment may be terminated by either party by providing ninety (90) days written notice or payment in lieu of notice. The Company may terminate immediately for cause including gross misconduct, fraud, or material breach of this agreement.",
        "clause_type": "termination",
        "contract_type": "employment",
        "law_reference": "Industrial Disputes Act 1947 Section 25F",
        "standard": "Standard employment termination with 90-day notice, compliant with Indian labour law."
    },
    {
        "text": "The Employee agrees not to engage in any business activity that directly competes with the Company's business during the term of employment. Post-employment restrictions shall be limited to twelve (12) months and restricted to the specific geographic area of employment.",
        "clause_type": "non_compete",
        "contract_type": "employment",
        "law_reference": "Indian Contract Act 1872 Section 27",
        "standard": "Reasonable non-compete limited to employment period plus 12 months post-employment with geographic limitation."
    },
    {
        "text": "All intellectual property, inventions, and work product created by the Employee during the course of employment and related to the Company's business shall be the exclusive property of the Company.",
        "clause_type": "ip_ownership",
        "contract_type": "employment",
        "law_reference": "Companies Act 2013, Copyright Act 1957 Section 17",
        "standard": "Standard employer IP ownership for work created during employment scope."
    },
    {
        "text": "The Employee shall be entitled to annual leave of twenty-one (21) days, sick leave of twelve (12) days, and casual leave of seven (7) days per calendar year, in accordance with applicable labour laws.",
        "clause_type": "other",
        "contract_type": "employment",
        "law_reference": "Factories Act 1948, Shops and Establishments Act",
        "standard": "Standard leave entitlement compliant with Indian labour laws."
    },
    {
        "text": "The Employee's compensation shall be reviewed annually. Any changes to compensation shall be communicated in writing at least thirty (30) days before the effective date.",
        "clause_type": "payment",
        "contract_type": "employment",
        "law_reference": "Payment of Wages Act 1936",
        "standard": "Standard salary review clause with written notice requirement."
    },
    {
        "text": "The Employee shall maintain strict confidentiality of all proprietary information, trade secrets, and business data of the Company during and for three (3) years after termination of employment.",
        "clause_type": "confidentiality",
        "contract_type": "employment",
        "law_reference": "Indian Contract Act 1872 Section 27, IT Act 2000 Section 43A",
        "standard": "Standard employee confidentiality with reasonable 3-year post-employment period."
    },
    {
        "text": "Any grievance by the Employee shall first be addressed through the Company's internal grievance redressal mechanism within thirty (30) days. Unresolved grievances may be referred to arbitration.",
        "clause_type": "dispute_resolution",
        "contract_type": "employment",
        "law_reference": "Industrial Disputes Act 1947 Section 9C",
        "standard": "Standard employment grievance mechanism compliant with Indian labour law."
    },

    # ── SERVICE AGREEMENT CLAUSES ──
    {
        "text": "Payment shall be made within thirty (30) days of receipt of invoice. Late payments shall attract interest at the rate of twelve percent (12%) per annum from the due date until actual payment.",
        "clause_type": "payment",
        "contract_type": "service",
        "law_reference": "Indian Contract Act 1872 Section 73, MSMED Act 2006",
        "standard": "Standard payment terms with reasonable 30-day period and 12% interest, compliant with MSMED Act."
    },
    {
        "text": "The Service Provider's total liability under this Agreement shall not exceed the total fees paid by the Client in the three (3) months immediately preceding the event giving rise to liability.",
        "clause_type": "liability_cap",
        "contract_type": "service",
        "law_reference": "Indian Contract Act 1872 Section 73",
        "standard": "Standard liability cap tied to contract value — fair and enforceable under Indian law."
    },
    {
        "text": "The Service Provider shall indemnify and hold harmless the Client against any third-party claims arising directly from the Service Provider's gross negligence or wilful misconduct in performing the services.",
        "clause_type": "indemnity",
        "contract_type": "service",
        "law_reference": "Indian Contract Act 1872 Section 124-125",
        "standard": "Standard indemnity limited to gross negligence — not unlimited indemnity which would be risky."
    },
    {
        "text": "Either party may terminate this Agreement for convenience by providing sixty (60) days written notice. The Client shall pay for all services rendered up to the termination date.",
        "clause_type": "termination",
        "contract_type": "service",
        "law_reference": "Indian Contract Act 1872 Section 73",
        "standard": "Standard termination for convenience with 60-day notice and payment for work done."
    },
    {
        "text": "Neither party shall be liable for delays or failures in performance resulting from acts beyond their reasonable control including natural disasters, government actions, or internet outages (Force Majeure).",
        "clause_type": "force_majeure",
        "contract_type": "service",
        "law_reference": "Indian Contract Act 1872 Section 32, 56",
        "standard": "Standard force majeure clause covering unforeseeable events, consistent with ICA 1872."
    },
    {
        "text": "All disputes shall first be attempted to be resolved through good faith negotiation within thirty (30) days. If unresolved, disputes shall be referred to arbitration under the Arbitration and Conciliation Act 1996.",
        "clause_type": "dispute_resolution",
        "contract_type": "service",
        "law_reference": "Arbitration and Conciliation Act 1996 Section 7",
        "standard": "Standard two-step dispute resolution: negotiation first, then arbitration."
    },
    {
        "text": "This Agreement shall be governed by the laws of India. The parties submit to the exclusive jurisdiction of the courts at Hyderabad, Telangana for any disputes not referred to arbitration.",
        "clause_type": "governing_law",
        "contract_type": "service",
        "law_reference": "Code of Civil Procedure 1908",
        "standard": "Standard governing law clause specifying Indian jurisdiction."
    },
    {
        "text": "Each party shall keep confidential the terms of this Agreement and all information disclosed by the other party. This obligation shall not apply to disclosures required by law or regulatory authority.",
        "clause_type": "confidentiality",
        "contract_type": "service",
        "law_reference": "Indian Contract Act 1872 Section 27",
        "standard": "Standard mutual confidentiality with carve-out for legal disclosure obligations."
    },

    # ── RERA SALE AGREEMENT CLAUSES ──
    {
        "text": "The Promoter shall hand over possession of the apartment to the Allottee by 31st December 2026, subject to force majeure conditions. Delay beyond this date shall attract compensation at the rate of SBI MCLR plus 2% per annum.",
        "clause_type": "other",
        "contract_type": "RERA",
        "law_reference": "RERA 2016 Section 18",
        "standard": "Standard RERA possession clause with specific date and compensation for delay as required by RERA Section 18."
    },
    {
        "text": "The Promoter shall maintain the project in good repair and condition for a period of five (5) years from the date of possession as required under RERA 2016.",
        "clause_type": "other",
        "contract_type": "RERA",
        "law_reference": "RERA 2016 Section 14(3)",
        "standard": "Standard RERA maintenance obligation for 5 years post-possession as mandated by law."
    },
    {
        "text": "In the event the Allottee wishes to withdraw from the project before possession, the Promoter shall refund all amounts paid with interest at SBI MCLR plus 2% within forty-five (45) days.",
        "clause_type": "termination",
        "contract_type": "RERA",
        "law_reference": "RERA 2016 Section 18(1)",
        "standard": "Standard RERA refund clause protecting buyer's right to withdraw with interest."
    },
    {
        "text": "The total sale consideration is INR [amount] only. No additional charges shall be levied except as specifically disclosed in the agreement and approved by RERA authority.",
        "clause_type": "payment",
        "contract_type": "RERA",
        "law_reference": "RERA 2016 Section 13",
        "standard": "Standard RERA payment transparency clause preventing hidden charges."
    },
    {
        "text": "Any structural defect or deficiency in workmanship reported within five (5) years of possession shall be rectified by the Promoter at no cost to the Allottee within thirty (30) days of receiving written notice.",
        "clause_type": "other",
        "contract_type": "RERA",
        "law_reference": "RERA 2016 Section 14(3)",
        "standard": "Standard RERA defect liability clause — mandatory 5-year structural defect warranty."
    },
    {
        "text": "All disputes between the Promoter and Allottee shall be resolved through the Real Estate Regulatory Authority or Real Estate Appellate Tribunal as established under RERA 2016.",
        "clause_type": "dispute_resolution",
        "contract_type": "RERA",
        "law_reference": "RERA 2016 Section 31, 43",
        "standard": "Standard RERA dispute resolution through statutory authority — mandatory for real estate disputes."
    },

    # ── ADDITIONAL HIGH-RISK PATTERNS (what BAD clauses look like) ──
    {
        "text": "The employee agrees not to work in the same industry anywhere in India for a period of five years after leaving the company.",
        "clause_type": "non_compete",
        "contract_type": "employment",
        "law_reference": "Indian Contract Act 1872 Section 27",
        "standard": "WARNING: Overly broad non-compete. 5 years + all of India is void under ICA 1872 Section 27 as restraint of trade."
    },
    {
        "text": "The service provider shall provide unlimited indemnification for any and all claims arising from any cause whatsoever without any cap on liability.",
        "clause_type": "indemnity",
        "contract_type": "service",
        "law_reference": "Indian Contract Act 1872 Section 124",
        "standard": "WARNING: Unlimited indemnity is extremely risky and may be unenforceable. Always include a liability cap."
    },
    {
        "text": "Either party may terminate this agreement with immediate effect and without notice at any time for any reason.",
        "clause_type": "termination",
        "contract_type": "employment",
        "law_reference": "Industrial Disputes Act 1947 Section 25F",
        "standard": "WARNING: Immediate termination without notice violates Indian labour law for employees. Minimum notice required."
    },
]

# ── EMBED AND STORE ALL CLAUSES ──
print(f"\nEmbedding {len(standard_clauses)} standard clauses...")

points = []
for i, clause in enumerate(standard_clauses):
    # Convert text to vector using sentence-transformers
    # This is the core of RAG — converting meaning to numbers
    vector = model.encode(clause["text"]).tolist()
    
    point = PointStruct(
        id=i + 1,           # Unique ID in Qdrant
        vector=vector,       # 384-dimensional embedding
        payload={            # Metadata stored alongside vector
            "text": clause["text"],
            "clause_type": clause["clause_type"],
            "contract_type": clause["contract_type"],
            "law_reference": clause["law_reference"],
            "standard": clause["standard"]
        }
    )
    points.append(point)
    print(f"  Embedded clause {i+1}/{len(standard_clauses)}: {clause['clause_type']} ({clause['contract_type']})")

# Upload all points to Qdrant
client.upsert(
    collection_name=COLLECTION_NAME,
    points=points
)

print(f"\n✓ Knowledge base built successfully!")
print(f"✓ {len(points)} standard clauses stored in Qdrant")
print(f"✓ Collection: {COLLECTION_NAME}")
print(f"\nYou can now run the deviation detector.")