module OpenAPI
  def self.generate(_site, _payload)
    return if @generated

    Dir.chdir('tools') do
      system 'npm install'
      system 'npm run merge -- --source ../spec --output ../_site/opensearch-openapi.yaml'
    end

    @generated = true
  end
end

Jekyll::Hooks.register :site, :post_write do |site, payload|
  OpenAPI.generate(site, payload)
end
