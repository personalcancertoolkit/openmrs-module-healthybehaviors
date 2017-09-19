
def return_total_domain_for_metrics(metric_domains, concept_identifiers, map_concept_name_to_metric_group_function):
    ## generate statistics for user comfort
    metric_concepts_count = dict();
    for metric in sorted(metric_domains.keys()):
        metric_concepts_count[metric] = 0;
    for concept in concept_identifiers:
        metric = map_concept_name_to_metric_group_function(concept[0]);
        metric_concepts_count[metric] += 1;
    total_metric_domains = dict();
    for metric in sorted(metric_domains.keys()):
        this_metric_domain = metric_domains[metric];
        number_of_concepts = metric_concepts_count[metric];
        total_metric_domains[metric] = (this_metric_domain[0] * number_of_concepts, this_metric_domain[1] * number_of_concepts);
    return total_metric_domains;