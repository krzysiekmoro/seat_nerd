INSTALL SKAFFOLD

CREATE ENV VARIABLES

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=yoursecuritystring
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_51NJZBNCcPKPAocU8qW3jbww3kSa56YKJPABxOHOmEiSiGPK3qfhQYsI4GME22f1PdgoYO1UxZdEQGHsujSB3Pfsr00nZHM4ehH