# Kubernetes development secrets

Create a local ignored file named `.env` containing `DATABASE_URL`, `MONGO_URI`, and `JWT_SECRET`, then apply it with:

```powershell
kubectl -n aws-simulation create secret generic eyouth-31005141801597-shopsphere-backend-secrets --from-env-file=k8s/secrets/.env --dry-run=client -o yaml | kubectl apply -f -
```

The Deployment already imports this Secret as environment variables. Never commit `k8s/secrets/.env`.
